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
    db.run('DELETE FROM teams WHERE id = ?', [teamId], function (err) {
        if (err) {
            console.log(err.message)
            return
        }

        db.all('SELECT * FROM teams', [], (err, rows) => {
            displayWindow.webContents.send('teams-updated', rows)
            controlWindow.webContents.send('teams-updated', rows)
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

  db.run(
    `UPDATE teams SET score = score ${operation} ? WHERE id = ?`,
    [value, teamId],
    function (err) {
      if (err) return
    
      db.run(
        `INSERT INTO history (action, team_id, value) VALUES (?, ?, ?)`,
        [type, teamId, value]
      )

      //kirim efek perubahan skor ke display
      const change = type === 'add' ? value : -value

      displayWindow.webContents.send('score-effect', {
        teamId,
        change
      })

      db.all(`SELECT * FROM teams`, [], (err, rows) => {
        displayWindow.webContents.send('teams-updated', rows)
        controlWindow.webContents.send('teams-updated', rows)
      })
    }
  )
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

      const { action, team_id, value, id } = last

      const reverseOp = action === 'add' ? '-' : '+'

      db.run(
        `UPDATE teams SET score = score ${reverseOp} ? WHERE id = ?`,
        [value, team_id],
        () => {
          // hapus history terakhir
          db.run(`DELETE FROM history WHERE id = ?`, [id])

          // update UI
          db.all(`SELECT * FROM teams`, [], (err, rows) => {
            displayWindow.webContents.send('teams-updated', rows)
            controlWindow.webContents.send('teams-updated', rows)
          })
        }
      )
    }
  )
})