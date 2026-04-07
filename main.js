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

//ambil semua tim saat awal
ipcMain.handle('get-teams', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM teams', [], (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })
})