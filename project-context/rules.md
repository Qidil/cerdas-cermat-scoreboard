# Rules — Coding Standards

> Didokumentasikan dari codebase yang sudah ada (spec-init) — diperbarui 30 Juli 2026.

## Naming Convention

| Elemen | Konvensi | Contoh |
|---|---|---|
| Variables | camelCase | `teamName`, `currentTime`, `isRunning` |
| Functions | camelCase | `handleAddTeam()`, `createWindow()` |
| React Components | PascalCase | `Display`, `Control`, `App` |
| Files (non-React) | kebab-case / lowercase | `main.js`, `preload.js`, `database.js` |
| Files (React) | PascalCase | `App.jsx` |
| CSS classes | kebab-case (Tailwind utility) | `bg-slate-900`, `text-4xl` |
| IPC channels | kebab-case | `update-team-score`, `start-timer` |
| Database columns | snake_case | `team_id`, `team_name`, `created_at` |

## Indentation & Formatting

| Aturan | Nilai |
|---|---|
| Indentasi | 2 spasi (semua file) |
| Quote (JS/JSX) | Double quotes (`"`) — konsisten di root files; campuran di frontend |
| Semicolon | Wajib (konsisten di semua file) |
| Trailing comma | Tidak digunakan di root files; digunakan di frontend config |

## Pola yang Teridentifikasi

1. **Electron IPC Pattern**: `ipcMain.on('channel', handler)` dan `ipcMain.handle('channel', handler)` di main process; `ipcRenderer.send('channel', data)` dan `ipcRenderer.invoke('channel')` di preload.
2. **React Component Pattern**: Satu file (`App.jsx`) berisi semua komponen. Display dan Control dalam file yang sama.
3. **Database Callback Pattern**: `sqlite3` callback-style (`db.run()`, `db.all()`, `db.get()` with `(err, rows)` callbacks).
4. **Error Handling**: Minimal — `if (err) return` pattern dengan `console.error` + broadcast `operation-error` ke Control Panel.

## eslint.config.js (Extracted Rules)

| Rule | Severity | Catatan |
|---|---|---|
| `no-unused-vars` | `error` | Kecuali `varsIgnorePattern: '^[A-Z_]'` |
| `react-hooks/exhaustive-deps` | `warn` (recommended) | Dari `reactHooks.configs.flat.recommended` |
| `react-refresh/only-export-components` | `warn` | Dari `reactRefresh.configs.vite` |

## Proses Kerja — Konfirmasi

| Aturan | Deskripsi |
|---|---|
| P-001 | Setelah selesai satu **phase**, jalankan **kedua gate berurutan** (spec-compliance → code-review) secara otomatis, tanpa konfirmasi per gate |
| P-002 | Perbaiki temuan gate langsung (BLOCKER/MAJOR di-fix, MINOR/INFO ditangani) lalu re-run gate, tanpa konfirmasi per temuan |
| P-003 | Jangan pernah **commit** atau **push ke GitHub** tanpa konfirmasi user terlebih dahulu |
| P-004 | Konfirmasi user hanya wajib untuk **commit/push**; setelah itu tunggu jawaban "ya/setuju" sebelum lanjut |

> Alasan: user ingin gate berjalan otomatis dan berurutan setelah setiap fase selesai, tanpa jeda konfirmasi per gate; kontrol penuh hanya dipegang pada titik commit/push ke remote.

## `[FORBIDDEN]` — Larangan Teknis

| Kode | Larangan | Alasan | Sanksi |
|---|---|---|---|
| F-001 | Dilarang menggunakan `nodeIntegration: true` di BrowserWindow | Ekspos Node.js ke renderer, risiko keamanan tinggi | BLOCKER |
| F-002 | Dilarang mengirim data sensitif (password/token) via IPC | IPC tidak terenkripsi | BLOCKER |
| F-003 | Dilarang menggunakan `var` — wajib `const` atau `let` | `var` memiliki function-scoping yang rawan bug | MAJOR |
| F-004 | Dilarang mencampur quote style dalam satu file | Mengurangi konsistensi dan readability | MAJOR |
| F-005 | Dilarang menggunakan `alert()` di production code | Mengganggu UX aplikasi desktop | MINOR |
| F-006 | Dilarang memanggil `setInterval()` tanpa `clearInterval()` pada cleanup | Menyebabkan memory leak (timer terus berjalan) | BLOCKER |
| F-007 | Dilarang menyimpan file backup di folder yang tidak di-gitignore | Bisa tercantum di git secara tidak sengaja | MAJOR |
| F-008 | Dilarang membuat objek Audio baru setiap render di React | Membuat ulang audio tiap re-render menyebabkan memory leak — wajib `useRef` | MAJOR |
