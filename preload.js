const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendScore: (data) => ipcRenderer.send('update-score', data),
    onScoreUpdate: (callback) => 
        ipcRenderer.on('score-updated', (event, data) => callback(data)),

    //tim
    addTeam: (name) => ipcRenderer.send('add-team', name),
    getTeams: () => ipcRenderer.invoke('get-teams'),
    onTeamsUpdate: (callback) => 
        ipcRenderer.on('teams-updated', (event, data) => callback(data))
})