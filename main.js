const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const db = require(path.join(__dirname, 'database.js'))
const fs = require('fs')
const {
  enqueue,
  withHistoryTransaction,
  archiveAndResetHistory,
  listMatchBackups,
  listHistoryArchives,
  readHistoryArchive,
  deleteHistoryArchive,
  historyToCsv,
  historyFileNamePattern
} = require('./history-transaction')

let displayWindow
let controlWindow

function getDataDir() {
  if (app.isPackaged) {
    const dir = path.join(app.getPath('userData'), 'cerdas-cermat-scoreboard')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    return dir
  }
  return __dirname
}

function createWindow() {
  const iconPath = path.join(__dirname, 'frontend', 'public', 'favicon.ico')

  displayWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  controlWindow = new BrowserWindow({
    width: 1100,
    height: 680,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  displayWindow.setTitle('Display')
  controlWindow.setTitle('Control Panel')

  if (app.isPackaged) {
    const distIndex = path.join(__dirname, 'frontend', 'dist', 'index.html')
    displayWindow.loadFile(distIndex, { hash: '/display' })
    controlWindow.loadFile(distIndex, { hash: '/control' })
  } else {
    displayWindow.loadURL('http://localhost:5173/#/display')
    controlWindow.loadURL('http://localhost:5173/#/control')
  }
}

app.whenReady().then(() => {
  const dataDir = getDataDir()
  const dbPath = path.join(dataDir, 'score.db')
  db.init(dbPath)

  const backupsDir = path.join(dataDir, 'backups')
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true })
  }

  createWindow()
})

app.on('before-quit', () => {
  clearInterval(timerInterval)
})

// IPC Listener
ipcMain.on('update-score', (event, data) => {
  displayWindow.webContents.send('score-updated', data)
})

// tambah tim
ipcMain.on('add-team', (event, teamName) => {
  withHistoryTransaction(db, (finish) => {
    db.run('INSERT INTO teams (name) VALUES (?)', [teamName], function (err) {
      if (err) return finish(err)
      const teamId = this.lastID
      db.run('INSERT INTO history (action, team_id, team_name) VALUES (?, ?, ?)', ['add-team', teamId, teamName], (historyError) => {
        if (historyError) return finish(historyError)
        finish(null, () => {
          db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (readError, history) => {
            if (!readError && controlWindow) controlWindow.webContents.send('history-updated', history)
          })
          db.all('SELECT * FROM teams', [], (readError, teams) => {
            if (readError) return
            if (displayWindow) displayWindow.webContents.send('teams-updated', teams)
            if (controlWindow) controlWindow.webContents.send('teams-updated', teams)
          })
        })
      })
    })
  }).catch((err) => {
    console.error('Error adding team or recording history:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal menambah tim atau mencatat riwayat: ' + err.message)
  })
})

//hapus tim
ipcMain.on('delete-team', (event, teamId) => {
  withHistoryTransaction(db, (finish) => {
    db.get('SELECT * FROM teams WHERE id = ?', [teamId], (err, team) => {
      if (err || !team) return finish(err || new Error('team not found'))
      db.run('DELETE FROM teams WHERE id = ?', [teamId], (deleteError) => {
        if (deleteError) return finish(deleteError)
        db.run('INSERT INTO history (action, team_id, team_name) VALUES (?, ?, ?)', ['delete-team', team.id, team.name], (historyError) => {
          if (historyError) return finish(historyError)
          finish(null, () => {
            db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (readError, history) => {
              if (!readError && controlWindow) controlWindow.webContents.send('history-updated', history)
            })
            db.all('SELECT * FROM teams', [], (readError, teams) => {
              if (readError) return
              if (displayWindow) displayWindow.webContents.send('teams-updated', teams)
              if (controlWindow) controlWindow.webContents.send('teams-updated', teams)
            })
          })
        })
      })
    })
  }).catch((err) => {
    console.error('Error deleting team or recording history:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal menghapus tim atau mencatat riwayat: ' + err.message)
  })
})

//ambil semua tim saat awal
ipcMain.handle('get-teams', async () => {
  return enqueue(db, () => new Promise((resolve, reject) => {
    db.all('SELECT * FROM teams', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  }))
})

//update skor per tim
ipcMain.on('update-team-score', (event, { teamId, value, type }) => {
  const operation = type === 'add' ? '+' : '-'

  withHistoryTransaction(db, (finish) => {
    db.get('SELECT name, score FROM teams WHERE id = ?', [teamId], (err, team) => {
      if (err || !team) return finish(err || new Error('team not found'))
      if (type === 'minus' && team.score - value < 0) return finish(new Error('Skor tidak boleh negatif'))
      db.run('UPDATE teams SET score = score ' + operation + ' ? WHERE id = ?', [value, teamId], (updateError) => {
        if (updateError) return finish(updateError)
        db.run('INSERT INTO history (action, team_id, team_name, value) VALUES (?, ?, ?, ?)', [type, teamId, team.name, value], (historyError) => {
          if (historyError) return finish(historyError)
          finish(null, () => {
            if (displayWindow) displayWindow.webContents.send('score-effect', { teamId, change: type === 'add' ? value : -value })
            db.all('SELECT * FROM teams', [], (readError, teams) => {
              if (readError) return
              if (displayWindow) displayWindow.webContents.send('teams-updated', teams)
              if (controlWindow) controlWindow.webContents.send('teams-updated', teams)
            })
            db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (readError, history) => {
              if (!readError && controlWindow) controlWindow.webContents.send('history-updated', history)
            })
          })
        })
      })
    })
  }).catch((err) => {
    console.error('Error updating score or recording history:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', err.message === 'Skor tidak boleh negatif' ? err.message : 'Gagal mengubah skor atau mencatat riwayat: ' + err.message)
  })
})

ipcMain.on('answer-feedback', (event, type) => {
  displayWindow.webContents.send('answer-feedback', type)
})

ipcMain.handle('get-history', async () => {
  return enqueue(db, () => new Promise((resolve, reject) => {
    db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (err, rows) => err ? reject(err) : resolve(rows))
  }))
})

function getHistoryArchiveDir() {
  return path.join(getDataDir(), 'backups', 'history')
}

ipcMain.handle('get-history-archives', () => enqueue(db, () => listHistoryArchives(fs, getHistoryArchiveDir())))

ipcMain.handle('export-history-csv', async (event, archiveFile = '') => {
  try {
    if (archiveFile && !historyFileNamePattern.test(archiveFile)) {
      throw new Error('Nama arsip history tidak valid')
    }
    const history = await enqueue(db, () => archiveFile
      ? readHistoryArchive(fs, getHistoryArchiveDir(), archiveFile).history
      : new Promise((resolve, reject) => {
        db.all('SELECT * FROM history ORDER BY id ASC', [], (err, rows) => err ? reject(err) : resolve(rows))
      }))
    const defaultPath = 'riwayat-' + (archiveFile ? path.basename(archiveFile, '.json') : 'aktif') + '-' + Date.now() + '.csv'
    const { canceled, filePath } = await dialog.showSaveDialog(controlWindow, {
      title: 'Export History CSV',
      defaultPath,
      filters: [{ name: 'CSV', extensions: ['csv'] }]
    })
    if (canceled || !filePath) return { canceled: true }
    fs.writeFileSync(filePath, '\uFEFF' + historyToCsv(history), { flag: 'w' })
    return { canceled: false, filePath }
  } catch (err) {
    console.error('Error exporting history CSV:', err.message)
    return { canceled: false, error: err.message }
  }
})

ipcMain.handle('delete-history-archive', async (event, fileName) => {
  try {
    if (!event.senderFrame || event.senderFrame !== event.sender.mainFrame) {
      throw new Error('Permintaan dari frame tidak diizinkan')
    }
    return await enqueue(db, () => deleteHistoryArchive(fs, getHistoryArchiveDir(), fileName))
  } catch (err) {
    console.error('Error deleting history archive:', err.message)
    throw new Error('Gagal menghapus arsip history: ' + err.message)
  }
})

ipcMain.on('reset-history', () => {
  archiveAndResetHistory(db, fs, path.join(getDataDir(), 'backups', 'history')).then((result) => {
    if (controlWindow) controlWindow.webContents.send('history-updated', [])
    if (controlWindow) controlWindow.webContents.send('history-reset-result', result)
  }).catch((err) => {
    console.error('Error archiving history:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal mengarsipkan riwayat: ' + err.message)
  })
})

ipcMain.on('save-match', () => {
  enqueue(db, () => new Promise((resolve, reject) => {
    db.all('SELECT * FROM teams', [], (err, teams) => {
      if (err) return reject(err)
      db.all('SELECT * FROM history', [], (historyError, history) => {
        if (historyError) return reject(historyError)
        try {
          const data = { teams, history, savedAt: new Date().toISOString() }
          const fileName = 'match-' + Date.now() + '.json'
          fs.writeFileSync(path.join(getDataDir(), 'backups', fileName), JSON.stringify(data, null, 2))
          if (controlWindow) controlWindow.webContents.send('save-success', fileName)
          resolve()
        } catch (writeError) {
          reject(writeError)
        }
      })
    })
  })).catch((err) => {
    console.error('Error saving match:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal menyimpan match: ' + err.message)
  })
})

ipcMain.handle('get-saved-files', () => {
  const dataDir = getDataDir()
  const dir = path.join(dataDir, 'backups')
  return listMatchBackups(fs, dir)
})

ipcMain.on('load-match', (event, fileName) => {
  enqueue(db, () => new Promise((resolve, reject) => {
    const filePath = path.join(getDataDir(), 'backups', fileName)

    if (!fs.existsSync(filePath)) {
      if (controlWindow) controlWindow.webContents.send('operation-error', 'File tidak ditemukan')
      return resolve()
    }

    let data
    try {
      data = JSON.parse(fs.readFileSync(filePath))
    } catch (err) {
      console.error('Error reading backup file:', err.message)
      if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal membaca file backup')
      return resolve()
    }

    db.serialize(() => {
      db.run('DELETE FROM teams')
      db.run('DELETE FROM history')

      data.teams.forEach((team) => {
        db.run('INSERT INTO teams (id, name, score) VALUES (?, ?, ?)', [team.id, team.name, team.score])
      })

      data.history.forEach((item) => {
        db.run('INSERT INTO history (id, action, team_id, team_name, value, created_at) VALUES (?, ?, ?, ?, ?, ?)', [item.id, item.action, item.team_id, item.team_name, item.value, item.created_at])
      })

      db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (err, rows) => {
        if (!err && controlWindow) controlWindow.webContents.send('history-updated', rows)
        if (err) {
          reject(err)
          return
        }
        if (displayWindow && controlWindow) {
          const teamsUpdated = new Promise((resolveTeams, rejectTeams) => {
            db.all('SELECT * FROM teams', [], (teamsError, teams) => {
              if (teamsError) return rejectTeams(teamsError)
              displayWindow.webContents.send('teams-updated', teams)
              controlWindow.webContents.send('teams-updated', teams)
              resolveTeams()
            })
          })
          teamsUpdated.then(resolve, reject)
        } else resolve()
      })
    })
  })).catch((err) => {
    console.error('Error loading match history:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal memuat match: ' + err.message)
  })
})

// settings
ipcMain.handle('get-setting', async (event, key) => {
  return enqueue(db, () => new Promise((resolve, reject) => {
    db.get('SELECT value FROM settings WHERE key = ?', [key], (err, row) => {
      if (err) reject(err)
      else resolve(row ? row.value : null)
    })
  }))
})

ipcMain.handle('get-all-settings', async () => {
  return enqueue(db, () => new Promise((resolve, reject) => {
    db.all('SELECT * FROM settings', [], (err, rows) => {
      if (err) reject(err)
      else {
        const settings = {}
        rows.forEach((row) => { settings[row.key] = row.value })
        resolve(settings)
      }
    })
  }))
})

ipcMain.on('set-setting', (event, { key, value }) => {
  enqueue(db, () => new Promise((resolve, reject) => db.run(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value],
    function (err) {
      if (err) return reject(err)
      resolve()
    }
  ))).then(() => {
    if (displayWindow) displayWindow.webContents.send('settings-updated', { key, value })
    if (controlWindow) controlWindow.webContents.send('settings-updated', { key, value })
  }).catch((err) => {
    console.error('Error saving setting:', err.message)
    if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal menyimpan pengaturan: ' + err.message)
  })
})

ipcMain.on('delete-setting', (event, key) => {
  enqueue(db, () => new Promise((resolve, reject) => db.run('DELETE FROM settings WHERE key = ?', [key], (err) => err ? reject(err) : resolve())))
    .then(() => {
      if (displayWindow) displayWindow.webContents.send('settings-updated', { key, value: null })
      if (controlWindow) controlWindow.webContents.send('settings-updated', { key, value: null })
    }).catch((err) => {
      console.error('Error deleting setting:', err.message)
      if (controlWindow) controlWindow.webContents.send('operation-error', 'Gagal menghapus pengaturan: ' + err.message)
    })
})

let timerInterval = null
let currentTime = 0
let isRunning = false

ipcMain.on('start-timer', (event, time) => {
  clearInterval(timerInterval)

  currentTime = time
  isRunning = true

  if (displayWindow) {
    displayWindow.webContents.send('timer-visibility', true)
    displayWindow.webContents.send('timer-update', currentTime)
  }

  timerInterval = setInterval(() => {
    currentTime--

    if (displayWindow) {
      displayWindow.webContents.send('timer-update', currentTime)
    }

    if (currentTime <= 0) {
      clearInterval(timerInterval)
      isRunning = false
    }
  }, 1000)
})

ipcMain.on('pause-timer', () => {
  clearInterval(timerInterval)
  isRunning = false
})

ipcMain.on('resume-timer', () => {
  if (isRunning || currentTime <= 0) return

  isRunning = true

  timerInterval = setInterval(() => {
    currentTime--

    if (displayWindow) {
      displayWindow.webContents.send('timer-update', currentTime)
    }

    if (currentTime <= 0) {
      clearInterval(timerInterval)
      isRunning = false
    }
  }, 1000)
})

ipcMain.on('reset-timer', () => {
  clearInterval(timerInterval)
  currentTime = 0
  isRunning = false

  if (displayWindow) {
    displayWindow.webContents.send('timer-update', currentTime)
    displayWindow.webContents.send('timer-visibility', false)
  }
})

// soal
ipcMain.on('show-question', (event, soal) => {
  if (displayWindow && soal) {
    const { answer, ...safeSoal } = soal
    displayWindow.webContents.send('show-question', safeSoal)
  }
})

ipcMain.on('hide-question', () => {
  if (displayWindow) {
    displayWindow.webContents.send('hide-question')
  }
})

ipcMain.handle('export-display-png', async () => {
  if (!displayWindow) return { canceled: true }

  try {
    const image = await displayWindow.webContents.capturePage()
    const { canceled, filePath } = await dialog.showSaveDialog(displayWindow, {
      title: 'Simpan Gambar Display',
      defaultPath: 'display-' + Date.now() + '.png',
      filters: [
        { name: 'PNG Image', extensions: ['png'] }
      ]
    })

    if (canceled || !filePath) return { canceled: true }

    fs.writeFileSync(filePath, image.toPNG())
    return { canceled: false, filePath }
  } catch (err) {
    console.error('Error exporting display PNG:', err.message)
    return { canceled: true, error: err.message }
  }
})

ipcMain.handle('get-data-dir', () => {
  return getDataDir()
})

ipcMain.on('open-data-dir', () => {
  shell.openPath(getDataDir())
})
