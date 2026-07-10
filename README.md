# Cerdas Cermat Scoreboard

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat secara real-time dengan dual-window: **Display** (layar penonton) dan **Control Panel** (layar operator).

> ⚠️ **Status:** Tahap pengembangan aktif. Fitur kustomisasi tampilan sudah fungsional. Script build untuk distribusi `.exe` **belum tersedia** — aplikasi hanya bisa dijalankan dalam mode development.

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

## 🔮 Rencana

- Distribusi `.exe` (Windows)
- Perbaikan startup timing (Vite + Electron)
