# Architecture — Cerdas Cermat Scoreboard

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Runtime | Node.js (via Electron 41) |
| Desktop Framework | Electron 41 |
| Frontend Framework | React 19 |
| Bundler | Vite 8 |
| Routing | React Router DOM 7 |
| CSS | Tailwind CSS 3 + PostCSS + Autoprefixer |
| Database | SQLite 3 (via `sqlite3` npm package) |
| IPC | Electron `ipcMain` / `ipcRenderer` + `contextBridge` |
| Linter | ESLint 9 (flat config) |
| Audio | Native HTML5 Audio API |
| Concurrency | `concurrently` (dev only) |

## Struktur Folder

```
cerdas-cermat-scoreboard/
├── main.js                    # Electron main process
├── preload.js                 # contextBridge / IPC preload
├── database.js                # SQLite schema & initialization
├── score.db                   # Database file (gitignored)
├── package.json               # Root dependencies (Electron, SQLite, concurrently)
├── .gitignore
├── package-lock.json          # Root lockfile
├── README.md
│
├── backups/                   # Match backup JSON files
│   └── match-*.json
│
├── frontend/
│   ├── .gitignore
│   ├── package-lock.json      # Frontend lockfile
│   ├── README.md
│   ├── node_modules/           # Frontend dependencies (gitignored)
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── eslint.config.js       # ESLint flat config
│   ├── package.json           # Frontend dependencies (React, Vite, Tailwind)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx           # React entry + BrowserRouter
│       ├── App.jsx            # Routes + Display + Control components
│       ├── App.css            # (boilerplate, tidak dipakai secara aktif)
│       ├── index.css          # Tailwind directives (@tailwind base/components/utilities)
│       └── assets/
│           ├── hero.png
│           ├── react.svg
│           ├── vite.svg
│           └── sounds/
│               ├── correct.mp3
│               ├── wrong.mp3
│               └── tick.mp3
│
├── node_modules/              # Root dependencies (gitignored)
│
├── .opencode/                 # AI workflow configuration
│   ├── skills/
│   └── node_modules/
│
└── .agents/                   # AI agent configurations
```

## Arsitektur Sistem

Aplikasi ini menggunakan arsitektur **Electron Dual-Window** dengan komunikasi **IPC (Inter-Process Communication)**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                     │
│                       main.js                                │
│                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│  │  IPC     │   │  SQLite  │   │  File    │                │
│  │ Handlers │──▶│  DB      │   │  System  │                │
│  │ (17 ch)  │   │  (R/W)   │   │  (backup)│                │
│  └──────────┘   └──────────┘   └──────────┘                │
│        │                                                   │
│        │ IPC (send/invoke)                                  │
│        ▼                                                   │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Renderer:       │  │ Renderer:       │                  │
│  │ DISPLAY Window  │  │ CONTROL Window  │                  │
│  │ localhost:5173/ │  │ localhost:5173/ │                  │
│  │ display         │  │ control         │                  │
│  │                 │  │                 │                  │
│  │ - Scoreboard    │  │ - Add/Delete    │                  │
│  │ - Score Effect  │  │ - Score +/-     │                  │
│  │ - Answer FB     │  │ - Answer FB btn │                  │
│  │ - Timer         │  │ - Timer Ctrl    │                  │
│  │                 │  │ - Match Save/   │                  │
│  │                 │  │   Load          │                  │
│  │                 │  │ - History       │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Alur Komunikasi

1. **Control Window** mengirim event IPC → **Main Process**
2. **Main Process** memproses (R/W database atau filesystem)
3. **Main Process** mengirim update ke **Display Window** dan/atau **Control Window**
4. **Preload (`preload.js`)** menjadi jembatan aman via `contextBridge.exposeInMainWorld`

## Dual Window

| Window | Route | Ukuran Default | Fungsi |
|---|---|---|---|
| Display | `/display` | 1000x700 | Menampilkan skor, animasi, feedback, timer |
| Control | `/control` | 800x600 | Admin panel untuk mengontrol semua aspek |

Kedua window terhubung ke server Vite yang sama (`localhost:5173`) dan di-routing oleh React Router.

## Database

- **Engine:** SQLite 3
- **Library:** `sqlite3` (npm, native addon)
- **File:** `score.db` (di root project, gitignored)
- **Tabel:** `teams` dan `history`
- **Inisialisasi:** `database.js` — `CREATE TABLE IF NOT EXISTS`

## Dependency Management

- **Package manager:** npm
- **Root dependencies:** `electron`, `sqlite3`, `concurrently`
- **Frontend dependencies:** `react`, `react-dom`, `react-router-dom`, `vite`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint` + plugins

## Packaging / Build ke .exe

Aplikasi ini direncanakan untuk di-package menjadi file `.exe` agar bisa dijalankan di Windows tanpa perlu Node.js atau npm.

**Opsi yang bisa digunakan:**
- `electron-builder` — mature, support Windows installer
- `electron-forge` — official Electron tooling

Keputusan packaging akan ditentukan setelah bug fix dan fitur kustomisasi selesai.

## Scripts

| Script | Perintah | Fungsi |
|---|---|---|
| `dev` | `cd frontend && npm run dev` | Jalankan Vite dev server |
| `electron` | `electron .` | Jalankan Electron |
| `start` | `concurrently "npm run dev" "npm run electron"` | Jalankan keduanya bersamaan |
| `build` (frontend) | `vite build` | Build frontend |
| `lint` (frontend) | `eslint .` | Linting |

## ADR (Architecture Decision Record)

| No | Keputusan | Alasan |
|---|---|---|
| ADR-001 | **Dual-window** (Display + Control) terpisah per route | Memisahkan tampilan publik dari kontrol admin; memungkinkan layar penuh di display tanpa UI kontrol |
| ADR-002 | **IPC via contextBridge**, bukan `nodeIntegration: true` | Keamanan — best practice Electron untuk mencegah akses Node.js dari renderer |
| ADR-003 | **SQLite** sebagai database | Cocok untuk aplikasi desktop lokal; data ringan; tidak perlu server database |
| ADR-004 | **Vite** sebagai bundler frontend | Cepat, HMD bawaan, modern |
| ADR-005 | **Tailwind CSS** untuk styling | Utility-first, cepat dalam prototyping UI |

> ⚠️ **Perlu verifikasi:** Apakah ada environment variable atau konfigurasi deployment yang perlu dicatat?
> ⚠️ **Perlu verifikasi:** Apakah ada rencana untuk distribusi (packaging) via electron-builder atau electron-forge?
