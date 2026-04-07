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