const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose()
const {
  enqueue,
  withHistoryTransaction,
  archiveAndResetHistory,
  listMatchBackups,
  listHistoryArchives,
  readHistoryArchive,
  deleteHistoryArchive,
  historyToCsv
} = require('../history-transaction')

const db = new sqlite3.Database(':memory:')
let testDataDir

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

function get(sql) {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => err ? reject(err) : resolve(row))
  })
}

async function main() {
  await run('CREATE TABLE teams (id INTEGER PRIMARY KEY, score INTEGER)')
  await run("CREATE TABLE history (id INTEGER PRIMARY KEY, action TEXT CHECK(action != 'blocked'), team_id INTEGER, team_name TEXT, value INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP)")
  await run('INSERT INTO teams (id, score) VALUES (1, 0)')

  await withHistoryTransaction(db, (finish) => {
    db.run('UPDATE teams SET score = 2 WHERE id = 1', (err) => {
      if (err) return finish(err)
      db.run('INSERT INTO history (action) VALUES (?)', ['add'], (historyError) => finish(historyError))
    })
  })

  await assert.rejects(withHistoryTransaction(db, (finish) => {
    db.run('UPDATE teams SET score = 5 WHERE id = 1', (err) => {
      if (err) return finish(err)
      db.run('INSERT INTO history (action) VALUES (?)', ['blocked'], (historyError) => finish(historyError))
    })
  }))

  assert.equal((await get('SELECT score FROM teams WHERE id = 1')).score, 2)
  assert.equal((await get('SELECT COUNT(*) AS count FROM history')).count, 1)

  const snapshot = enqueue(db, () => get('SELECT score FROM teams WHERE id = 1').then((row) => row.score))
  const laterMutation = withHistoryTransaction(db, (finish) => {
    db.run('UPDATE teams SET score = 7 WHERE id = 1', (err) => finish(err))
  })
  assert.equal(await snapshot, 2)
  await laterMutation
  assert.equal((await get('SELECT score FROM teams WHERE id = 1')).score, 7)

  const action = (name) => withHistoryTransaction(db, (finish) => {
    db.run('UPDATE teams SET score = score + 1 WHERE id = 1', (err) => {
      if (err) return finish(err)
      db.run('INSERT INTO history (action) VALUES (?)', [name], (historyError) => finish(historyError))
    })
  })
  await Promise.all([action('rapid-1'), action('rapid-2')])
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT action FROM history WHERE action LIKE 'rapid-%' ORDER BY rowid", (err, result) => err ? reject(err) : resolve(result))
  })
  assert.deepEqual(rows.map((row) => row.action), ['rapid-1', 'rapid-2'])
  assert.equal((await get('SELECT score FROM teams WHERE id = 1')).score, 9)

  testDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cerdas-cermat-history-'))
  const archiveDir = path.join(testDataDir, 'backups', 'history')
  await run("INSERT INTO history (action, team_id, team_name, value) VALUES ('add', 3, ?, 1)", ['=1+1'])
  await run("INSERT INTO history (action, team_id, team_name, value) VALUES ('add', 4, ?, 1)", ['Team, "One"'])
  const archived = await archiveAndResetHistory(db, fs, archiveDir)
  assert.equal(archived.count, 5)
  assert.equal((await get('SELECT COUNT(*) AS count FROM history')).count, 0)
  assert.equal((await get('SELECT score FROM teams WHERE id = 1')).score, 9)
  const archivePath = path.join(archiveDir, archived.file)
  assert.equal(JSON.parse(fs.readFileSync(archivePath, 'utf8')).history.length, 5)
  const matchBackupFs = {
    existsSync: () => true,
    readdirSync: () => ['match-1.json', 'history'],
    statSync: (file) => ({ isFile: () => !file.endsWith('history') })
  }
  assert.deepEqual(listMatchBackups(matchBackupFs, 'backups'), ['match-1.json'])
  assert.deepEqual(await archiveAndResetHistory(db, fs, archiveDir), { empty: true })
  const listedArchives = listHistoryArchives(fs, archiveDir)
  assert.equal(listedArchives.length, 1)
  assert.equal(listedArchives[0].count, 5)
  assert.equal(readHistoryArchive(fs, archiveDir, archived.file).history.length, 5)

  const csv = historyToCsv([
    { id: 1, action: 'add', team_id: 1, team_name: '=1+1', value: 2, created_at: '2026-01-01' },
    { id: 2, action: 'add', team_id: 2, team_name: 'Team, "One"\nNext', value: 1, created_at: '2026-01-02' }
  ])
  assert.ok(csv.startsWith('"id","action","team_id","team_name","value","created_at"\r\n'))
  assert.ok(csv.includes('"\'=1+1"'))
  assert.ok(csv.includes('"Team, ""One""\nNext"'))

  assert.throws(() => deleteHistoryArchive(fs, archiveDir, '../' + archived.file))
  assert.throws(() => deleteHistoryArchive(fs, archiveDir, 'history-999-1rows.json'))
  const directoryArchive = path.join(archiveDir, 'history-998-1rows.json')
  fs.mkdirSync(directoryArchive)
  assert.throws(() => deleteHistoryArchive(fs, archiveDir, path.basename(directoryArchive)))
  fs.rmdirSync(directoryArchive)
  const badArchives = [
    ['history-999-1rows.json', '{'],
    ['history-998-1rows.json', JSON.stringify({ history: [{ ...JSON.parse(fs.readFileSync(archivePath, 'utf8')).history[0], id: 'bad' }] })]
  ]
  for (const [name, contents] of badArchives) fs.writeFileSync(path.join(archiveDir, name), contents)
  const badLinks = listHistoryArchives(fs, archiveDir).filter((entry) => entry.count === null)
  assert.deepEqual(badLinks.map((entry) => entry.file).sort(), badArchives.map(([name]) => name).sort())
  assert.throws(() => readHistoryArchive(fs, archiveDir, badArchives[0][0]))
  for (const [name] of badArchives) fs.unlinkSync(path.join(archiveDir, name))
  const otherName = 'history-123-2rows.json'
  const otherPath = path.join(archiveDir, otherName)
  fs.writeFileSync(otherPath, JSON.stringify({history: []}))
  assert.deepEqual(deleteHistoryArchive(fs, archiveDir, archived.file), { deleted: true, fileName: archived.file })
  assert.equal(fs.existsSync(archivePath), false)
  assert.equal(fs.existsSync(otherPath), true)
  assert.equal((await get('SELECT COUNT(*) AS count FROM history')).count, 0)
  assert.equal((await get('SELECT score FROM teams WHERE id = 1')).score, 9)
  fs.unlinkSync(otherPath)

  await withHistoryTransaction(db, (finish) => {
    db.run('INSERT INTO history (action) VALUES (?)', ['keep'], (err) => finish(err))
  })
  const failingFs = { ...fs, openSync: () => { throw new Error('disk full') } }
  await assert.rejects(archiveAndResetHistory(db, failingFs, archiveDir), /disk full/)
  assert.equal((await get('SELECT COUNT(*) AS count FROM history')).count, 1)

  const partialWriteFs = { ...fs, writeFileSync: (fd, contents) => {
    fs.writeFileSync(fd, contents.slice(0, 10))
    throw new Error('partial write')
  } }
  await assert.rejects(archiveAndResetHistory(db, partialWriteFs, archiveDir), /partial write/)
  assert.equal((await get('SELECT COUNT(*) AS count FROM history')).count, 1)
  assert.equal(fs.readdirSync(archiveDir).length, 0)

  await run("CREATE TRIGGER fail_history_delete BEFORE DELETE ON history BEGIN SELECT RAISE(ABORT, 'delete blocked'); END")
  await assert.rejects(archiveAndResetHistory(db, fs, archiveDir), /delete blocked/)
  assert.equal((await get('SELECT COUNT(*) AS count FROM history')).count, 1)
  assert.equal(fs.readdirSync(archiveDir).length, 0)

  console.log('PASS: history transactions, archive/reset, CSV escaping, and selected permanent deletion')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
}).finally(() => {
  db.close()
  if (testDataDir) fs.rmSync(testDataDir, { recursive: true, force: true })
})
