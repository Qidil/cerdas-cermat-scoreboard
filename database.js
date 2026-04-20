const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./score.db')

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
      team_name INTEGER,
      value INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

module.exports = db