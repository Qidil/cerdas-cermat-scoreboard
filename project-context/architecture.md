# Architecture — Cerdas Cermat Scoreboard

> Didokumentasikan dari codebase yang sudah ada (spec-init) — diperbarui 30 Juli 2026.

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Runtime | Node.js (via Electron 41) |
| Desktop Framework | Electron 41 |
| Frontend Framework | React 19 |
| Bundler | Vite 8 |
| Routing | React Router DOM 7 (HashRouter) |
| CSS | Tailwind CSS 3 + PostCSS + Autoprefixer |
| Database | SQLite 3 (via `sqlite3` npm package) |
| IPC | Electron `ipcMain` / `ipcRenderer` + `contextBridge` |
| Linter | ESLint 9 (flat config) |
| Audio | Native HTML5 Audio API |
| Concurrency | `concurrently` (dev only) |
| Packaging | `electron-packager` |
| Native Rebuild | `@electron/rebuild` |

## Struktur Folder

```
cerdas-cermat-scoreboard/
├── main.js                    # Electron main process
├── preload.js                 # contextBridge / IPC preload
├── database.js                # SQLite schema & initialization
├── score.db                   # Database file (gitignored)
├── package.json               # Root dependencies
├── .gitignore
├── package-lock.json          # Root lockfile
├── README.md
│
├── backups/                   # Match backup JSON files
│   └── match-*.json
│
├── screenshot/                # Screenshot aplikasi
│   ├── control panel_pengaturan skor.png
│   ├── control panel_pengaturan tampilan_1.png
│   └── control panel_pengaturan tampilan_2.png
│
├── release/                   # Output electron-packager (gitignored)
│   └── Cerdas Cermat Scoreboard-win32-x64/
│
├── frontend/
│   ├── .gitignore
│   ├── package-lock.json      # Frontend lockfile
│   ├── README.md
│   ├── node_modules/           # Frontend dependencies (gitignored)
│   ├── index.html             # HTML entry point (title: "Cerdas Cermat Scoreboard")
│   ├── vite.config.js         # Vite configuration (base: './')
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── eslint.config.js       # ESLint flat config
│   ├── package.json           # Frontend dependencies
│   ├── public/
│   │   ├── favicon.svg        # Favicon browser (logo "CC")
│   │   └── favicon.ico        # Icon jendela Electron (11KB)
│   └── src/
│       ├── main.jsx           # React entry + HashRouter
│       ├── App.jsx            # Routes + Display + Control components
│       ├── App.css            # (boilerplate)
│       ├── index.css          # Tailwind directives
│       └── assets/
│           └── sounds/
│               ├── correct.mp3
│               ├── wrong.mp3
│               └── tick.mp3
│
├── node_modules/              # Root dependencies (gitignored)
│
├── .opencode/                 # AI workflow configuration (gitignored)
│
└── .agents/                   # AI agent configurations (gitignored)
```

## Arsitektur Sistem

Aplikasi ini menggunakan arsitektur **Electron Dual-Window** dengan komunikasi **IPC (Inter-Process Communication)**.

```
┌────────────────────────────────────────────────────────────┐
│                    Electron Main Process                    │
│                       main.js                               │
│                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│  │  IPC     │   │  SQLite  │   │  File    │               │
│  │ Handlers │──▶│  DB      │   │  System  │               │
│  │ (22+ ch) │   │  (R/W)   │   │  (backup)│               │
│  └──────────┘   └──────────┘   └──────────┘               │
│        │                                                   │
│        │ IPC (send/invoke)                                  │
│        ▼                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Renderer:        │  │ Renderer:        │                │
│  │ DISPLAY Window   │  │ CONTROL Window   │                │
│  │ Title: "Display" │  │ Title: "Control  │                │
│  │ localhost:5173/  │  │   Panel"         │                │
│  │ display          │  │ localhost:5173/  │                │
│  │                  │  │ control          │                │
│  │ - Scoreboard     │  │ - TIM card       │                │
│  │ - Score Effect   │  │ - SKOR card      │                │
│  │ - Answer FB      │  │ - TIMER card     │                │
│  │ - Timer          │  │ - DATA card      │                │
│  │ - Kustomisasi    │  │ - TAMPILAN card   │                │
│  └──────────────────┘  └──────────────────┘                │
└────────────────────────────────────────────────────────────┘
```

### Alur Komunikasi

1. **Control Window** mengirim event IPC → **Main Process**
2. **Main Process** memproses (R/W database atau filesystem)
3. **Main Process** mengirim update ke **Display Window** dan/atau **Control Window**
4. **Preload (`preload.js`)** menjadi jembatan aman via `contextBridge.exposeInMainWorld`

## Dual Window

| Window | Route | Title Bar | Ukuran Default | Fungsi |
|---|---|---|---|---|
| Display | `/display` | "Display" | 1000x700 | Menampilkan skor, animasi, feedback, timer, kustomisasi |
| Control | `/control` | "Control Panel" | 800x600 | Admin panel card-based: TIM, SKOR, TIMER, DATA, TAMPILAN |

Kedua window terhubung ke server Vite yang sama (`localhost:5173` saat dev, atau file `index.html` saat production) dan di-routing oleh React Router.

Production: `loadFile(frontend/dist/index.html, { hash: '/display' })` via `app.isPackaged` detection.

## Database

- **Engine:** SQLite 3
- **Library:** `sqlite3` (npm, native addon — perlu `@electron/rebuild` tiap ganti versi Electron)
- **File:** `score.db` (di root project saat dev, di `userData` saat production, gitignored)
- **Tabel:** `teams`, `history`, `settings`
- **Inisialisasi:** `database.js` — `CREATE TABLE IF NOT EXISTS`

Data user saat production (.exe):
- **Windows:** `C:\Users\<username>\AppData\Roaming\cerdas-cermat-scoreboard\`
- **Linux:** `~/.config/cerdas-cermat-scoreboard/`
- **macOS:** `~/Library/Application Support/cerdas-cermat-scoreboard/`

## Dependency Management

- **Package manager:** npm
- **Root dependencies:** `electron`, `sqlite3`, `concurrently`, `electron-packager`, `@electron/rebuild`
- **Frontend dependencies:** `react`, `react-dom`, `react-router-dom`, `vite`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint` + plugins

## Packaging / Build ke .exe

Aplikasi menggunakan **`electron-packager`** untuk build distribusi Windows.

Proses build:
1. `npm run build:vite` — build frontend ke `frontend/dist/`
2. `npm run build:exe` — package Electron + frontend ke `release/`

Output: folder portable `release/Cerdas Cermat Scoreboard-win32-x64/` dengan file `.exe` yang bisa dijalankan langsung tanpa instalasi.

## Scripts

| Script | Perintah | Fungsi |
|---|---|---|
| `dev` | `cd frontend && npm run dev` | Jalankan Vite dev server |
| `electron` | `electron .` | Jalankan Electron |
| `start` | `concurrently "npm run dev" "npm run electron"` | Jalankan keduanya bersamaan |
| `build:vite` | `cd frontend && npm run build` | Build frontend ke `frontend/dist/` |
| `build:exe` | `electron-packager ...` | Package .exe distribusi ke `release/` |
| `lint` (frontend) | `eslint .` | Linting |

## ADR (Architecture Decision Record)

| No | Keputusan | Alasan |
|---|---|---|
| ADR-001 | **Dual-window** (Display + Control) terpisah per route | Memisahkan tampilan publik dari kontrol admin; memungkinkan layar penuh di display tanpa UI kontrol |
| ADR-002 | **IPC via contextBridge**, bukan `nodeIntegration: true` | Keamanan — best practice Electron untuk mencegah akses Node.js dari renderer |
| ADR-003 | **SQLite** sebagai database | Cocok untuk aplikasi desktop lokal; data ringan; tidak perlu server database |
| ADR-004 | **Vite** sebagai bundler frontend | Cepat, HMD bawaan, modern |
| ADR-005 | **Tailwind CSS** untuk styling | Utility-first, cepat dalam prototyping UI |
| ADR-006 | **HashRouter** (bukan BrowserRouter) | Kompatibel dengan `file://` protocol di production Electron; `base: './'` di Vite |
| ADR-007 | **electron-packager** untuk distribusi | Sederhana, output folder portable tanpa installer; cocok untuk distribusi via flashdisk |
| ADR-008 | **Tabel settings** di SQLite | Menyimpan semua konfigurasi kustomisasi secara persistent; key-value sederhana tanpa perlu migrasi |
| ADR-009 | **Card-based Control Panel** | Memisahkan fungsi per kartu (TIM, SKOR, TIMER, DATA, TAMPILAN); card TAMPILAN collapsible untuk menghemat ruang |
