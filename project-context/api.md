# API — IPC Endpoint Documentation

> Didokumentasikan dari codebase yang sudah ada (spec-init) — diperbarui 30 Juli 2026.
> Komunikasi antara Renderer (React) dan Main Process (Electron) melalui IPC.

## Pola Komunikasi

| Pola | Method | Keterangan |
|---|---|---|
| `send` / `on` | `ipcMain.on()` / `ipcRenderer.send()` | Fire-and-forget, tidak ada return value |
| `handle` / `invoke` | `ipcMain.handle()` / `ipcRenderer.invoke()` | Request-response (Promise-based) |

Semua API di-expose ke renderer via `contextBridge` di `preload.js` sebagai `window.electronAPI`.

---

## 1. Team Management

### 1.1 Get All Teams

| | |
|---|---|
| **Pattern** | `handle` / `invoke` |
| **Channel** | `get-teams` |
| **Trigger** | `electronAPI.getTeams()` |
| **Response** | `Array<{ id: number, name: string, score: number }>` |

### 1.2 Add Team

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `add-team` |
| **Trigger** | `electronAPI.addTeam(name)` |
| **Payload** | `string` — nama tim |
| **Effect** | INSERT ke `teams` + INSERT ke `history` (action: `add-team`) |
| **Broadcast** | `teams-updated` → Display + Control |
| | `history-updated` → Control |

### 1.3 Delete Team

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `delete-team` |
| **Trigger** | `electronAPI.deleteTeam(id)` |
| **Payload** | `number` — team ID |
| **Effect** | DELETE dari `teams` + INSERT ke `history` (action: `delete-team`) |
| **Broadcast** | `teams-updated` → Display + Control |
| | `history-updated` → Control |

---

## 2. Score Management

### 2.1 Update Team Score

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `update-team-score` |
| **Trigger** | `electronAPI.updateTeamScore({ teamId, value, type })` |
| **Payload** | `{ teamId: number, value: number, type: 'add' \| 'minus' }` |
| **Effect** | UPDATE `teams.score` ( + atau - ) + INSERT ke `history`; validasi skor tidak negatif |
| **Broadcast** | `teams-updated` → Display + Control |
| | `history-updated` → Control |
| | `score-effect` → Display |

### 2.2 Answer Feedback

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `answer-feedback` |
| **Trigger** | `electronAPI.sendFeedback(type)` |
| **Payload** | `string` — `'correct'` atau `'wrong'` |
| **Broadcast** | `answer-feedback` → Display (trigger overlay SVG + suara) |

### 2.3 Legacy Score Update

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `update-score` |
| **Trigger** | `electronAPI.sendScore(data)` |
| **Payload** | `any` |
| **Broadcast** | `score-updated` → Display |
| **Catatan** | Tidak digunakan di frontend saat ini. Mungkin legacy. |

---

## 3. History

### 3.1 Get History

| | |
|---|---|
| **Pattern** | `handle` / `invoke` |
| **Channel** | `get-history` |
| **Trigger** | `electronAPI.getHistory()` |
| **Response** | `Array<{ id, action, team_id, team_name, value, created_at }>` — 20 record terbaru DESC |

### 3.2 History Update (auto-push)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `history-updated` |
| **Trigger** | Otomatis setelah `add-team`, `delete-team`, `update-team-score` |
| **Payload** | `Array<{ id, action, team_id, team_name, value, created_at }>` — 20 record terbaru |

---

## 4. Match Save & Load

### 4.1 Save Match

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `save-match` |
| **Trigger** | `electronAPI.saveMatch()` |
| **Effect** | Backup semua `teams` + `history` ke file JSON di `backups/match-{timestamp}.json` |
| **Broadcast** | `save-success` → Control (payload: nama file) |

### 4.2 Get Saved Files

| | |
|---|---|
| **Pattern** | `handle` / `invoke` |
| **Channel** | `get-saved-files` |
| **Trigger** | `electronAPI.getSavedFiles()` |
| **Response** | `string[]` — daftar nama file backup |

### 4.3 Load Match

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `load-match` |
| **Trigger** | `electronAPI.loadMatch(fileName)` |
| **Payload** | `string` — nama file backup |
| **Effect** | DELETE semua `teams` + `history`, lalu INSERT ulang dari data backup |
| **Broadcast** | `teams-updated` → Display + Control |
| | `history-updated` → Control |

---

## 5. Timer

### 5.1 Start Timer

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `start-timer` |
| **Trigger** | `electronAPI.startTimer(seconds)` |
| **Payload** | `number` — durasi dalam detik |
| **Effect** | Memulai interval countdown 1 detik; clear interval sebelumnya untuk cegah duplikasi |
| **Broadcast** | `timer-visibility` (true) → Display |
| | `timer-update` (nilai detik) → Display (setiap detik) |

### 5.2 Pause Timer

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `pause-timer` |
| **Trigger** | `electronAPI.pauseTimer()` |
| **Effect** | Menghentikan interval timer |

### 5.3 Resume Timer

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `resume-timer` |
| **Trigger** | `electronAPI.resumeTimer()` |
| **Effect** | Melanjutkan interval timer (hanya jika timer aktif dan > 0) |
| **Broadcast** | `timer-update` (nilai detik) → Display (setiap detik) |

### 5.4 Reset Timer

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `reset-timer` |
| **Trigger** | `electronAPI.resetTimer()` |
| **Effect** | Menghentikan interval + reset nilai ke 0 |
| **Broadcast** | `timer-update` (0) → Display |
| | `timer-visibility` (false) → Display |

### 5.5 Timer Update (auto-push)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `timer-update` |
| **Trigger** | Setiap detik saat timer berjalan, atau saat start/pause/resume/reset |
| **Payload** | `number` — nilai detik saat ini |

### 5.6 Timer Visibility (auto-push)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `timer-visibility` |
| **Trigger** | `start-timer` (true) atau `reset-timer` (false) |
| **Payload** | `boolean` |

---

## 6. Teams Update (auto-push)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `teams-updated` |
| **Trigger** | Otomatis setelah `add-team`, `delete-team`, `update-team-score`, `load-match` |
| **Payload** | `Array<{ id, name, score }>` — semua tim |
| **Target** | Display + Control |

---

## 7. Score Effect (auto-push)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `score-effect` |
| **Trigger** | Setelah `update-team-score` |
| **Payload** | `{ teamId: number, change: number }` — perubahan skor (positif/negatif) |
| **Target** | Display (trigger animasi pop) |

---

## 8. Settings Management (CRUD)

### 8.1 Get Setting

| | |
|---|---|
| **Pattern** | `handle` / `invoke` |
| **Channel** | `get-setting` |
| **Trigger** | `electronAPI.getSetting(key)` |
| **Payload** | `string` — key pengaturan |
| **Response** | `string \| null` — nilai pengaturan, atau null jika tidak ditemukan |

### 8.2 Get All Settings

| | |
|---|---|
| **Pattern** | `handle` / `invoke` |
| **Channel** | `get-all-settings` |
| **Trigger** | `electronAPI.getAllSettings()` |
| **Response** | `object` — semua settings sebagai key-value pair |

### 8.3 Set Setting

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `set-setting` |
| **Trigger** | `electronAPI.setSetting(key, value)` |
| **Payload** | `{ key: string, value: string }` |
| **Effect** | INSERT atau UPDATE (ON CONFLICT) di tabel `settings` |
| **Broadcast** | `settings-updated` → Display |

### 8.4 Delete Setting

| | |
|---|---|
| **Pattern** | `send` / `on` |
| **Channel** | `delete-setting` |
| **Trigger** | `electronAPI.deleteSetting(key)` |
| **Payload** | `string` — key pengaturan |
| **Effect** | DELETE dari tabel `settings` |
| **Broadcast** | `settings-updated` → Display (payload: `{ key, value: null }`) |

### 8.5 Settings Updated (auto-push)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `settings-updated` |
| **Trigger** | Setelah `set-setting` atau `delete-setting` |
| **Payload** | `{ key: string, value: string \| null }` |
| **Target** | Display (update tampilan real-time) |

---

## 9. Operation Error (Broadcast)

| | |
|---|---|
| **Pattern** | Broadcast |
| **Channel** | `operation-error` |
| **Trigger** | Ketika operasi gagal (skor negatif, duplikat nama tim, file tidak ditemukan) |
| **Payload** | `string` — pesan error dalam Bahasa Indonesia |
| **Target** | Control (ditampilkan sebagai alert) |

---

## 10. Soal (Question Display)

### 10.1 Show Question

| | |
|---|---|
| **Pattern** | send / on |
| **Channel** | `show-question` |
| **Trigger** | `electronAPI.showQuestion(soal)` |
| **Payload** | `{ id: string, type: 'pilihan_ganda' \| 'isian' \| 'benar_salah', question: string, options?: string[], answer?: string }` |
| **Effect** | Mengirim soal ke Display — ditampilkan sebagai popup |
| **Broadcast** | `show-question` → Display |

### 10.2 Hide Question

| | |
|---|---|
| **Pattern** | send / on |
| **Channel** | `hide-question` |
| **Trigger** | `electronAPI.hideQuestion()` |
| **Effect** | Menghapus popup soal dari Display |
| **Broadcast** | `hide-question` → Display |

---

## 11. Export Display PNG

| | |
|---|---|
| **Pattern** | handle / invoke |
| **Channel** | `export-display-png` |
| **Trigger** | `electronAPI.exportDisplayPng()` |
| **Effect** | `displayWindow.webContents.capturePage()` → dialog pilih lokasi → simpan file PNG |
| **Response** | `{ canceled: boolean, filePath?: string }` — status export |
| **Target** | Control (tab Histori) |

---

## Ringkasan Channel

| Channel | Type | Direction | Payload |
|---|---|---|---|
| `get-teams` | invoke→handle | renderer→main | — |
| `add-team` | send→on | renderer→main | `string` (team name) |
| `delete-team` | send→on | renderer→main | `number` (team id) |
| `update-team-score` | send→on | renderer→main | `{ teamId, value, type }` |
| `answer-feedback` | send→on | renderer→main | `'correct' \| 'wrong'` |
| `update-score` | send→on | renderer→main | `any` (legacy) |
| `get-history` | invoke→handle | renderer→main | — |
| `save-match` | send→on | renderer→main | — |
| `get-saved-files` | invoke→handle | renderer→main | — |
| `load-match` | send→on | renderer→main | `string` (filename) |
| `start-timer` | send→on | renderer→main | `number` (seconds) |
| `pause-timer` | send→on | renderer→main | — |
| `resume-timer` | send→on | renderer→main | — |
| `reset-timer` | send→on | renderer→main | — |
| `get-setting` | invoke→handle | renderer→main | `string` (key) |
| `get-all-settings` | invoke→handle | renderer→main | — |
| `set-setting` | send→on | renderer→main | `{ key, value }` |
| `delete-setting` | send→on | renderer→main | `string` (key) |
| `teams-updated` | send→on | main→renderer | `Team[]` |
| `history-updated` | send→on | main→renderer | `History[]` |
| `score-updated` | send→on | main→renderer | `any` (legacy) |
| `score-effect` | send→on | main→renderer | `{ teamId, change }` |
| `answer-feedback` | send→on | main→renderer | `'correct' \| 'wrong'` |
| `save-success` | send→on | main→renderer | `string` (filename) |
| `timer-update` | send→on | main→renderer | `number` |
| `timer-visibility` | send→on | main→renderer | `boolean` |
| `settings-updated` | send→on | main→renderer | `{ key, value }` |
| `operation-error` | send→on | main→renderer | `string` (error message) |
| `show-question` | send→on | renderer→main | `object` (soal) |
| `hide-question` | send→on | renderer→main | — |
| `export-display-png` | invoke→handle | renderer→main | — |
| `show-question` (broadcast) | send→on | main→renderer | `object` (soal) |
| `hide-question` (broadcast) | send→on | main→renderer | — |
