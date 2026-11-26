const path = require('node:path')
const queues = new WeakMap()
const historyFileNamePattern = /^history-\d+-\d+rows\.json$/

function enqueue(db, operation) {
  const previous = queues.get(db) || Promise.resolve()
  const result = previous.then(operation)
  queues.set(db, result.then(() => undefined, () => undefined))
  return result
}

function withHistoryTransaction(db, operation) {
  return enqueue(db, () => new Promise((resolve, reject) => {
    db.run('BEGIN IMMEDIATE', (beginError) => {
      if (beginError) return reject(beginError)

      let finished = false
      const finish = (error, afterCommit) => {
        if (finished) return
        finished = true

        if (error) {
          return db.run('ROLLBACK', (rollbackError) => reject(rollbackError || error))
        }

        db.run('COMMIT', (commitError) => {
          if (!commitError) {
            if (afterCommit) afterCommit()
            return resolve()
          }
          db.run('ROLLBACK', () => reject(commitError))
        })
      }

      try {
        operation(finish)
      } catch (error) {
        finish(error)
      }
    })
  }))
}

function archiveAndResetHistory(db, fs, archiveDir) {
  return enqueue(db, () => new Promise((resolve, reject) => {
    db.all('SELECT * FROM history ORDER BY id ASC', [], (readError, history) => {
      if (readError) return reject(readError)
      if (history.length === 0) return resolve({ empty: true })

      const fileName = 'history-' + Date.now() + '-' + history.length + 'rows.json'
      const archivePath = path.join(archiveDir, fileName)

      let archiveCreated = false
      let archiveFd
      try {
        fs.mkdirSync(archiveDir, { recursive: true })
        archiveFd = fs.openSync(archivePath, 'wx')
        archiveCreated = true
        fs.writeFileSync(archiveFd, JSON.stringify({
          archivedAt: new Date().toISOString(),
          count: history.length,
          history
        }, null, 2))
        fs.closeSync(archiveFd)
        archiveFd = undefined
      } catch (error) {
        if (archiveFd !== undefined) fs.closeSync(archiveFd)
        if (archiveCreated) {
          try {
            fs.unlinkSync(archivePath)
          } catch (cleanupError) {
            error.archiveCleanupError = cleanupError.message
          }
        }
        return reject(error)
      }

      const removeArchive = (error) => {
        try {
          fs.unlinkSync(archivePath)
        } catch (cleanupError) {
          error.archiveCleanupError = cleanupError.message
        }
        return error
      }

      db.run('BEGIN IMMEDIATE', (beginError) => {
        if (beginError) return reject(removeArchive(beginError))

        db.run('DELETE FROM history', function (deleteError) {
          if (deleteError) {
            return db.run('ROLLBACK', (rollbackError) => {
              reject(removeArchive(rollbackError || deleteError))
            })
          }

          db.run('COMMIT', (commitError) => {
            if (commitError) {
              return db.run('ROLLBACK', (rollbackError) => {
                reject(removeArchive(rollbackError || commitError))
              })
            }

            resolve({ file: fileName, count: history.length, rows: [] })
          })
        })
      })
    })
  }))
}

function listMatchBackups(fs, backupDir) {
  if (!fs.existsSync(backupDir)) return []
  return fs.readdirSync(backupDir).filter((file) => file.endsWith('.json') && fs.statSync(path.join(backupDir, file)).isFile())
}

function getHistoryArchivePath(fs, pathModule, archiveDir, fileName) {
  if (typeof fileName !== 'string' || !historyFileNamePattern.test(fileName)) {
    throw new Error('Nama arsip history tidak valid')
  }
  const resolvedDir = pathModule.resolve(archiveDir)
  const resolvedPath = pathModule.resolve(resolvedDir, fileName)
  const relative = pathModule.relative(resolvedDir, resolvedPath)
  if (!relative || relative.startsWith('..') || pathModule.isAbsolute(relative)) {
    throw new Error('Path arsip history tidak valid')
  }
  const archiveRootStat = fs.lstatSync(pathModule.dirname(resolvedDir))
  if (!archiveRootStat.isDirectory() || archiveRootStat.isSymbolicLink()) throw new Error('Folder backup tidak valid')
  const dirStat = fs.lstatSync(resolvedDir)
  if (!dirStat.isDirectory() || dirStat.isSymbolicLink()) throw new Error('Folder arsip history tidak valid')
  const fileStat = fs.lstatSync(resolvedPath)
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) throw new Error('File arsip history tidak valid')
  return { resolvedDir, resolvedPath, fileStat }
}

function isHistoryRow(row) {
  return row && Number.isInteger(row.id) && typeof row.action === 'string' &&
    (row.team_id === null || Number.isInteger(row.team_id)) &&
    (row.team_name === null || typeof row.team_name === 'string') &&
    (row.value === null || Number.isInteger(row.value)) && typeof row.created_at === 'string'
}

function readHistoryArchive(fs, archiveDir, fileName) {
  const { resolvedPath, fileStat } = getHistoryArchivePath(fs, path, archiveDir, fileName)
  const noFollow = fs.constants.O_NOFOLLOW || 0
  const fd = fs.openSync(resolvedPath, fs.constants.O_RDONLY | noFollow)
  let source
  try {
    const openedStat = fs.fstatSync(fd)
    if (!openedStat.isFile() || openedStat.dev !== fileStat.dev || openedStat.ino !== fileStat.ino) {
      throw new Error('File arsip history berubah saat dibaca')
    }
    source = fs.readFileSync(fd, 'utf8')
  } finally {
    fs.closeSync(fd)
  }
  const archive = JSON.parse(source)
  if (!archive || !Array.isArray(archive.history) || !archive.history.every(isHistoryRow)) {
    throw new Error('Isi arsip history tidak valid')
  }
  return archive
}

function listHistoryArchives(fs, archiveDir) {
  if (!fs.existsSync(archiveDir)) return []
  const dirStat = fs.lstatSync(archiveDir)
  if (!dirStat.isDirectory() || dirStat.isSymbolicLink()) throw new Error('Folder arsip history tidak valid')
  return fs.readdirSync(archiveDir)
    .filter((file) => historyFileNamePattern.test(file))
    .map((file) => {
      try {
        const { fileStat } = getHistoryArchivePath(fs, path, archiveDir, file)
        const archive = readHistoryArchive(fs, archiveDir, file)
        return { file, size: fileStat.size, count: Array.isArray(archive.history) ? archive.history.length : null }
      } catch {
        return { file, size: null, count: null }
      }
    })
    .sort((a, b) => Number(b.file.match(/^history-(\d+)-/)[1]) - Number(a.file.match(/^history-(\d+)-/)[1]))
}

function deleteHistoryArchive(fs, archiveDir, fileName) {
  const { resolvedPath, fileStat } = getHistoryArchivePath(fs, path, archiveDir, fileName)
  const currentStat = fs.lstatSync(resolvedPath)
  if (currentStat.dev !== fileStat.dev || currentStat.ino !== fileStat.ino || !currentStat.isFile() || currentStat.isSymbolicLink()) {
    throw new Error('File arsip history berubah sebelum dihapus')
  }
  fs.unlinkSync(resolvedPath)
  return { deleted: true, fileName }
}

function quoteCsvCell(value) {
  let cell = value == null ? '' : String(value)
  if (typeof value === 'string' && /^[\s]*[=+\-@]/.test(cell)) cell = "'" + cell
  return `"${cell.replace(/"/g, '""')}"`
}

function historyToCsv(history) {
  if (!Array.isArray(history) || !history.every(isHistoryRow)) throw new Error('Isi history tidak valid')
  return [
    ['id', 'action', 'team_id', 'team_name', 'value', 'created_at'],
    ...history.map((row) => [row.id, row.action, row.team_id, row.team_name, row.value, row.created_at])
  ].map((row) => row.map(quoteCsvCell).join(',')).join('\r\n') + '\r\n'
}

module.exports = {
  enqueue,
  withHistoryTransaction,
  archiveAndResetHistory,
  listMatchBackups,
  listHistoryArchives,
  readHistoryArchive,
  deleteHistoryArchive,
  historyToCsv,
  historyFileNamePattern
}
