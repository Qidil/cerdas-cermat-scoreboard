# Cerdas Cermat Scoreboard

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat secara real-time dengan dual-window: **Display** (layar penonton) dan **Control Panel** (layar operator).

> ⚠️ **Status:** Tahap pengembangan aktif. Fitur kustomisasi tampilan sudah fungsional. Untuk panduan build `.exe`, lihat branch **[`exe-v1`](https://github.com/Qidil/cerdas-cermat-scoreboard/tree/exe-v1)**.

---

## 🚀 Fitur

- Manajemen tim (tambah/hapus tim)
- Skor real-time dengan animasi perubahan (+/-)
- Timer countdown dengan suara tick
- Feedback visual & suara (benar/salah)
- Backup & restore data match
- **Kustomisasi tampilan** (header, warna, gambar background, logo, font, sponsor)

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, Vite 8, React Router, Tailwind CSS 3 |
| Desktop | Electron 41 |
| Database | SQLite 3 (via `sqlite3` native addon) |
| Komunikasi | IPC (contextBridge) |

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v3-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
 
## 📦 Instalasi

```bash
npm install
cd frontend && npm install
```

## ▶️ Menjalankan

```bash
npm start
```

Aplikasi akan membuka dua window: Display (`/display`) dan Control (`/control`).

**Catatan:** Pastikan `Vite dev server` sudah siap sebelum Electron terhubung. Jika `ERR_CONNECTION_REFUSED`, jalankan ulang.

## 🗂️ Struktur Proyek

```
├── frontend/          # React app (Vite)
│   ├── src/
│   │   ├── App.jsx   # Display + Control components
│   │   └── assets/   # Suara (correct, wrong, tick)
│   └── dist/         # Build output
├── main.js           # Electron main process
├── preload.js        # IPC bridge
├── database.js       # SQLite inisialisasi
├── project-context/  # Dokumen spesifikasi
└── score.db          # Database runtime (gitignored)
```

## 📥 Download & Build `.exe`

**Download langsung (Google Drive):** [Klik di sini](https://drive.google.com/drive/folders/1GyO5aDpVRsyr9xK_pBO4mlJ1T9vkCoLR?usp=sharing)

**Build sendiri:** Panduan lengkap ada di branch **[`exe-v1`](https://github.com/Qidil/cerdas-cermat-scoreboard/tree/exe-v1#-panduan-membuat-exe-distribusi)**.

## 🔮 Rencana

- Perbaikan startup timing (Vite + Electron)
