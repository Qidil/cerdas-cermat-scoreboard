const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const db = require(path.join(__dirname, 'database.js'))
const fs = require('fs')

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
  displayWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  controlWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
  db.run(
    'INSERT INTO teams (name) VALUES (?)',
    [teamName],
    function (err) {
      if (err) {
        console.error('Error adding team:', err.message)
        controlWindow.webContents.send('operation-error', 'Gagal menambah tim: ' + err.message)
        return
      }

      db.run(
        'INSERT INTO history (action, team_id, team_name) VALUES (?, ?, ?)',
        ['add-team', this.lastID, teamName]
      )

      db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (err, rows) => {
        if (!err) controlWindow.webContents.send('history-updated', rows)
      })

      db.all('SELECT * FROM teams', [], (err, rows) => {
        if (err) return
        displayWindow.webContents.send('teams-updated', rows)
        controlWindow.webContents.send('teams-updated', rows)
      })
    }
  )
})

//hapus tim
ipcMain.on('delete-team', (event, teamId) => {
  db.get('SELECT * FROM teams WHERE id = ?', [teamId], (err, team) => {
    if (err || !team) {
      console.error('Error deleting team:', err ? err.message : 'team not found')
      return
    }

    db.run('DELETE FROM teams WHERE id = ?', [teamId], function (err) {
      if (err) {
        console.error('Error deleting team:', err.message)
        return
      }

      db.run(
        'INSERT INTO history (action, team_id, team_name) VALUES (?, ?, ?)',
        ['delete-team', team.id, team.name]
      )

      db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (err, rows) => {
        if (!err) controlWindow.webContents.send('history-updated', rows)
      })

      db.all('SELECT * FROM teams', [], (err, rows) => {
        if (err) return
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

  db.get('SELECT name, score FROM teams WHERE id = ?', [teamId], (err, team) => {
    if (err || !team) {
      console.error('Error updating score:', err ? err.message : 'team not found')
      return
    }

    if (type === 'minus' && team.score - value < 0) {
      controlWindow.webContents.send('operation-error', 'Skor tidak boleh negatif')
      return
    }

    db.run(
      'UPDATE teams SET score = score ' + operation + ' ? WHERE id = ?',
      [value, teamId],
      function (err) {
        if (err) {
          console.error('Error updating score:', err.message)
          return
        }

        db.run(
          'INSERT INTO history (action, team_id, team_name, value) VALUES (?, ?, ?, ?)',
          [type, teamId, team.name, value]
        )

        const change = type === 'add' ? value : -value

        displayWindow.webContents.send('score-effect', {
          teamId,
          change
        })

        db.all('SELECT * FROM teams', [], (err, rows) => {
          if (err) return
          displayWindow.webContents.send('teams-updated', rows)
          controlWindow.webContents.send('teams-updated', rows)
        })

        db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (err, rows) => {
          if (!err) controlWindow.webContents.send('history-updated', rows)
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
      'SELECT * FROM history ORDER BY id DESC LIMIT 20',
      [],
      (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      }
    )
  })
})

ipcMain.on('save-match', () => {
  db.all('SELECT * FROM teams', [], (err, teams) => {
    if (err) {
      console.error('Error saving match:', err.message)
      return
    }

    db.all('SELECT * FROM history', [], (err, history) => {
      if (err) {
        console.error('Error saving match:', err.message)
        return
      }

      const data = {
        teams,
        history,
        savedAt: new Date().toISOString()
      }

      const fileName = 'match-' + Date.now() + '.json'
      const dataDir = getDataDir()
      const filePath = path.join(dataDir, 'backups', fileName)

      try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        controlWindow.webContents.send('save-success', fileName)
      } catch (err) {
        console.error('Error writing backup file:', err.message)
      }
    })
  })
})

ipcMain.handle('get-saved-files', () => {
  const dataDir = getDataDir()
  const dir = path.join(dataDir, 'backups')

  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
})

ipcMain.on('load-match', (event, fileName) => {
  const dataDir = getDataDir()
  const filePath = path.join(dataDir, 'backups', fileName)

  if (!fs.existsSync(filePath)) {
    controlWindow.webContents.send('operation-error', 'File tidak ditemukan')
    return
  }

  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath))
  } catch (err) {
    console.error('Error reading backup file:', err.message)
    controlWindow.webContents.send('operation-error', 'Gagal membaca file backup')
    return
  }

  db.serialize(() => {
    db.run('DELETE FROM teams')
    db.run('DELETE FROM history')

    data.teams.forEach((team) => {
      db.run(
        'INSERT INTO teams (id, name, score) VALUES (?, ?, ?)',
        [team.id, team.name, team.score]
      )
    })

    data.history.forEach((item) => {
      db.run(
        'INSERT INTO history (id, action, team_id, team_name, value, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [item.id, item.action, item.team_id, item.team_name, item.value, item.created_at]
      )
    })

    db.all('SELECT * FROM teams', [], (err, rows) => {
      if (err) return
      displayWindow.webContents.send('teams-updated', rows)
      controlWindow.webContents.send('teams-updated', rows)
    })

    db.all('SELECT * FROM history ORDER BY id DESC LIMIT 20', [], (err, rows) => {
      if (!err) controlWindow.webContents.send('history-updated', rows)
    })
  })
})

// settings
ipcMain.handle('get-setting', async (event, key) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM settings WHERE key = ?', [key], (err, row) => {
      if (err) reject(err)
      else resolve(row ? row.value : null)
    })
  })
})

ipcMain.handle('get-all-settings', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM settings', [], (err, rows) => {
      if (err) reject(err)
      else {
        const settings = {}
        rows.forEach((row) => { settings[row.key] = row.value })
        resolve(settings)
      }
    })
  })
})

ipcMain.on('set-setting', (event, { key, value }) => {
  db.run(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value],
    function (err) {
      if (err) {
        console.error('Error saving setting:', err.message)
        return
      }
      if (displayWindow) displayWindow.webContents.send('settings-updated', { key, value })
    }
  )
})

ipcMain.on('delete-setting', (event, key) => {
  db.run('DELETE FROM settings WHERE key = ?', [key], function (err) {
    if (err) {
      console.error('Error deleting setting:', err.message)
      return
    }
    if (displayWindow) displayWindow.webContents.send('settings-updated', { key, value: null })
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
