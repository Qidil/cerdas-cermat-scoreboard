const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendScore: (data) => ipcRenderer.send('update-score', data),
    onScoreUpdate: (callback) => 
        ipcRenderer.on('score-updated', (event, data) => callback(data))
})