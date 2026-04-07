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
})

module.exports = db