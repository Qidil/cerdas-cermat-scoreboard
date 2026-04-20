const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendScore: (data) => ipcRenderer.send('update-score', data),
    onScoreUpdate: (callback) => 
        ipcRenderer.on('score-updated', (event, data) => callback(data)),

    //tim
    addTeam: (name) => ipcRenderer.send('add-team', name),
    deleteTeam: (id) => ipcRenderer.send('delete-team', id),
    getTeams: () => ipcRenderer.invoke('get-teams'),
    onTeamsUpdate: (callback) => 
        ipcRenderer.on('teams-updated', (event, data) => callback(data)),
    updateTeamScore: (data) => ipcRenderer.send('update-team-score', data),
    onScoreEffect: (callback) => 
        ipcRenderer.on('score-effect', (event, data) => callback(data)),
    sendFeedback: (type) => ipcRenderer.send('answer-feedback', type),
    onFeedback: (callback) => 
        ipcRenderer.on('answer-feedback', (event, data) => callback(data)),
    undo: () => ipcRenderer.send('undo'),
})