const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const db = require(path.join(__dirname, 'database.js'))
const fs = require('fs')

let displayWindow
let controlWindow

function createWindow() {
    // papan skor
    displayWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: __dirname + '/preload.js'
        }
    })

    displayWindow.loadURL('http://localhost:5173/display')

    // bagian kontrol
    controlWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + '/preload.js'
        }
    })

    controlWindow.loadURL('http://localhost:5173/control')
}

app.whenReady().then(createWindow)

// IPC Listener
ipcMain.on('update-score', (event, data) => {
    console.log('Data dari kontrol:', data)

    //kirim ke display
    displayWindow.webContents.send('score-updated', data)
})

// tambah tim
ipcMain.on('add-team', (event, teamName) => {
    db.run(
        'INSERT INTO teams (name) VALUES (?)',
        [teamName],
        function (err) {
            if (err) {
                console.log('Error:', err.message)
                return
            }

            db.run(
                'INSERT INTO history (action, team_id, team_name) VALUES (?, ?, ?)',
                ['add-team', this.lastID, teamName]
            )

            db.all(`SELECT * FROM history ORDER BY id DESC LIMIT 20`, [], (err, rows) => {
                controlWindow.webContents.send('history-updated', rows)
            })

            //ambil semua tim terbaru
            db.all('SELECT * FROM teams', [], (err, rows) => {
                displayWindow.webContents.send('teams-updated', rows)
                controlWindow.webContents.send('teams-updated', rows)
            })
        }
    )
})

//hapus tim
ipcMain.on('delete-team', (event, teamId) => {
  // ambil dulu data tim
  db.get(`SELECT * FROM teams WHERE id = ?`, [teamId], (err, team) => {
    if (!team) return

    db.run(`DELETE FROM teams WHERE id = ?`, [teamId], function (err) {
      if (err) return

      // simpan history
      db.run(
        `INSERT INTO history (action, team_id, team_name) VALUES (?, ?, ?)`,
        ['delete-team', team.id, team.name]
      )

      db.all(`SELECT * FROM history ORDER BY id DESC LIMIT 20`, [], (err, rows) => {
        controlWindow.webContents.send('history-updated', rows)
      })

      db.all(`SELECT * FROM teams`, [], (err, rows) => {
        displayWindow.webContents.send('teams-updated', rows)
        controlWindow.webContents.send('teams-updated', rows)
      })
    })
  })
})

//ambil semua tim saat awal
ipcMain.handle('get-teams', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM teams', [], (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })
})

//update skor per tim
ipcMain.on('update-team-score', (event, { teamId, value, type }) => {
  const operation = type === 'add' ? '+' : '-'

  // 🔥 ambil nama tim dulu
  db.get(`SELECT name FROM teams WHERE id = ?`, [teamId], (err, team) => {
    if (!team) return

    db.run(
      `UPDATE teams SET score = score ${operation} ? WHERE id = ?`,
      [value, teamId],
      function (err) {
        if (err) return

        // ✅ simpan history lengkap
        db.run(
          `INSERT INTO history (action, team_id, team_name, value) VALUES (?, ?, ?, ?)`,
          [type, teamId, team.name, value]
        )

        const change = type === 'add' ? value : -value

        displayWindow.webContents.send('score-effect', {
          teamId,
          change
        })

        db.all(`SELECT * FROM teams`, [], (err, rows) => {
          displayWindow.webContents.send('teams-updated', rows)
          controlWindow.webContents.send('teams-updated', rows)
        })

        // 🔥 update history realtime
        db.all(`SELECT * FROM history ORDER BY id DESC LIMIT 20`, [], (err, rows) => {
          controlWindow.webContents.send('history-updated', rows)
        })
      }
    )
  })
})

ipcMain.on('answer-feedback', (event, type) => {
    displayWindow.webContents.send('answer-feedback', type)
})

ipcMain.handle('get-history', async () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM history ORDER BY id DESC LIMIT 20`,
      [],
      (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      }
    )
  })
})

ipcMain.on('save-match', () => {
  db.all(`SELECT * FROM teams`, [], (err, teams) => {
    if (err) return

    db.all(`SELECT * FROM history`, [], (err, history) => {
      if (err) return

      const data = {
        teams,
        history,
        savedAt: new Date().toISOString()
      }

      const fileName = `match-${Date.now()}.json`
      const filePath = path.join(__dirname, 'backups', fileName)

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

      controlWindow.webContents.send('save-success', fileName)
    })
  })
})

ipcMain.handle('get-saved-files', () => {
  const dir = path.join(__dirname, 'backups')

  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
})

ipcMain.on('load-match', (event, fileName) => {
  const filePath = path.join(__dirname, 'backups', fileName)

  if (!fs.existsSync(filePath)) return

  const data = JSON.parse(fs.readFileSync(filePath))

  db.serialize(() => {
    db.run(`DELETE FROM teams`)
    db.run(`DELETE FROM history`)

    // insert teams
    data.teams.forEach((team) => {
      db.run(
        `INSERT INTO teams (id, name, score) VALUES (?, ?, ?)`,
        [team.id, team.name, team.score]
      )
    })

    // insert history
    data.history.forEach((item) => {
      db.run(
        `INSERT INTO history (id, action, team_id, team_name, value, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.action,
          item.team_id,
          item.team_name,
          item.value,
          item.created_at
        ]
      )
    })

    // 🔥 PINDAHKAN UPDATE UI KE SINI (PALING AKHIR)
    db.all(`SELECT * FROM teams`, [], (err, rows) => {
      displayWindow.webContents.send('teams-updated', rows)
      controlWindow.webContents.send('teams-updated', rows)
    })

    db.all(`SELECT * FROM history ORDER BY id DESC LIMIT 20`, [], (err, rows) => {
      controlWindow.webContents.send('history-updated', rows)
    })
  })
})