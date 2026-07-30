const sqlite3 = require('sqlite3').verbose()

let db = null

function init(dbPath) {
  db = new sqlite3.Database(dbPath)

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        score INTEGER DEFAULT 0
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        team_id INTEGER,
        team_name TEXT,
        value INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `)
  })

  return db
}

const handler = {
  get(target, propKey) {
    if (propKey === 'init') return init
    if (propKey === 'db') return db
    if (db === null) {
      throw new Error('Database not initialized. Call init(dbPath) first.')
    }
    if (typeof db[propKey] === 'function') {
      return db[propKey].bind(db)
    }
    return db[propKey]
  }
}

const proxy = new Proxy({}, handler)
proxy.init = init

module.exports = proxy