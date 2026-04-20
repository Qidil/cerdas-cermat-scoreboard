const { app, BrowserWindow, ipcMain } = require('electron')

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

const path = require('path')
const db = require(path.join(__dirname, 'database.js'))

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

ipcMain.on('undo', () => {
  db.get(
    `SELECT * FROM history ORDER BY id DESC LIMIT 1`,
    [],
    (err, last) => {
      if (!last) return

      const { action, team_id, team_name, value, id } = last

      if (action === 'add') {
        db.run(`UPDATE teams SET score = score - ? WHERE id = ?`, [value, team_id])
      }

      else if (action === 'minus') {
        db.run(`UPDATE teams SET score = score + ? WHERE id = ?`, [value, team_id])
      }

      else if (action === 'add-team') {
        db.run(`DELETE FROM teams WHERE id = ?`, [team_id])
      }

      else if (action === 'delete-team') {
        db.run(
          `INSERT INTO teams (id, name, score) VALUES (?, ?, 0)`,
          [team_id, team_name]
        )
      }

      // simpan aksi undo
        db.run(
        `INSERT INTO history (action, team_id, team_name, value) VALUES (?, ?, ?, ?)`,
        ['undo', team_id, team_name, value]
        )

      // hapus history terakhir
      db.run(`DELETE FROM history WHERE id = ?`, [id])

      db.all(`SELECT * FROM history ORDER BY id DESC LIMIT 20`, [], (err, rows) => {
        controlWindow.webContents.send('history-updated', rows)
        })

      // update UI
      db.all(`SELECT * FROM teams`, [], (err, rows) => {
        displayWindow.webContents.send('teams-updated', rows)
        controlWindow.webContents.send('teams-updated', rows)
      })
    }
  )
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