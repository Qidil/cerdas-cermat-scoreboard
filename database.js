const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./score.db')

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS teams (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INTEGER DEFAULT 0)')

    db.run('CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER, action TEXT, value INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)')
})

module.exports = db