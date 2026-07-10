# Cerdas Cermat Scoreboard

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat secara real-time dengan dual-window: **Display** (layar penonton) dan **Control Panel** (layar operator).

> ⚠️ **Status:** Tahap pengembangan aktif. Fitur kustomisasi tampilan sudah fungsional. Untuk mencoba versi distribusi `.exe`, lihat branch **[`exe-v1`](https://github.com/Qidil/cerdas-cermat-scoreboard/tree/exe-v1)**.

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

## 📥 Download

Unduh versi portable `.exe` dari branch **[`exe-v1`](https://github.com/Qidil/cerdas-cermat-scoreboard/tree/exe-v1)**. Ekstrak ZIP lalu jalankan `Cerdas Cermat Scoreboard.exe`.

## 🔮 Rencana

- Perbaikan startup timing (Vite + Electron)
