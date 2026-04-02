const { app, BrowserWindow } = require('electron')

let displayWindow
let controlWindow

function createWindow() {
    // papan skor
    displayWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        title: 'Cerdas Cermat Scoreboard',
    })

    displayWindow.loadURL('http://localhost:5173/display')

    // bagian kontrol
    controlWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Cerdas Cermat Control',
    })

    controlWindow.loadURL('http://localhost:5173/control')
}

app.whenReady().then(createWindow)

require('./database')