# Cerdas Cermat Scoreboard

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat secara real-time dengan dual-window: **Display** (layar penonton) dan **Control Panel** (layar operator).

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-41-47848F?logo=electron&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)

Scoreboard lomba cerdas cermat masih sering menggunakan metode manual (papan tulis, spidol, kertas) yang rawan kesalahan input, tidak real-time, dan menyulitkan panitia saat harus mengumumkan skor secara cepat. Aplikasi digital yang ada di pasaran umumnya berbasis web, membutuhkan koneksi internet, tidak bisa dikustomisasi untuk kebutuhan lomba tertentu, dan tampilannya terlalu umum.

Aplikasi ini ditujukan untuk panitia lomba cerdas cermat di sekolah, kampus, pesantren, atau instansi yang membutuhkan scoreboard digital profesional — real-time, mudah dioperasikan, dan bisa dikustomisasi tampilannya sesuai tema acara.

Cerdas Cermat Scoreboard menjawab semua masalah itu dengan menghadirkan aplikasi desktop dual-window yang bekerja sepenuhnya secara lokal tanpa perlu internet. Window Display menampilkan skor di layar penonton dengan animasi real-time, sementara Control Panel digunakan operator untuk mengatur skor, timer, dan kustomisasi tampilan. Aplikasi ini mendukung manajemen tim, timer countdown dengan suara, feedback visual & audio, backup data, serta kustomisasi penuh — semua tersimpan di database lokal.

---

## Key Features

- **Manajemen Tim** — tambah/hapus tim, tampil real-time di kedua window
- **Skor Real-time** — tambah/kurang skor dengan animasi pop-up (+/-) di Display
- **Timer Countdown** — start, pause, resume, reset, dengan suara tick tiap detik dan animasi pulse
- **Feedback Visual & Audio** — overlay hijau/merah fullscreen (SVG centang/X putih 70vh) + suara benar/salah
- **Backup & Restore** — simpan/load match ke file JSON
- **Kustomisasi Header** — ubah teks header, warna, font (upload .ttf), ukuran (px), posisi offset (X/Y), bold/reguler
- **Kustomisasi Warna Teks** — header, nama tim, skor, timer, footer — masing-masing bisa diatur sendiri
- **Kustomisasi Background** — warna solid (color picker) atau upload gambar, lengkap dengan logo watermark (opacity bisa diatur)
- **Kustomisasi Font** — upload font .ttf per elemen (header, nama tim, skor, timer, footer), ukuran (input number, min 1), posisi offset (X/Y), gap antar tim
- **Bold/Reguler Toggle** — pilih bold atau reguler untuk masing-masing elemen teks
- **Sponsor Management** — tambah logo sponsor (upload + hapus), hide sponsor toggle
- **Card-based Control Panel** — UI terorganisir per fungsi: TIM, SKOR, TIMER, DATA, TAMPILAN

---

## Challenges

Tantangan terbesar dalam pembuatan aplikasi ini:

1. **Dual-window architecture** — display dan control panel berjalan di dua window terpisah yang harus tetap sinkron real-time melalui IPC tanpa delay
2. **Native SQLite di Electron** — native module `sqlite3` harus di-rebuild ulang (`@electron/rebuild`) untuk setiap versi Electron yang berbeda
3. **Kustomisasi tampilan real-time** — gambar/font diupload sebagai base64 dan langsung dirender tanpa restart aplikasi
4. **Distribusi .exe portable** — satu folder portable yang bisa jalan langsung dari flashdisk tanpa instalasi
5. **Ukuran distribusi** — file .exe ~212 MB melebihi batas 100 MB GitHub, distribusi via Google Drive

---

## Tech Choices

- **Electron 41** — platform desktop cross-platform dengan akses penuh ke file system, cocok untuk aplikasi lokal yang menyimpan data di disk
- **React 19** — library UI deklaratif untuk antarmuka reaktif real-time antara display dan control panel
- **Vite 8** — build tool cepat dengan Hot Module Replacement (HMR) yang mempercepat development
- **Tailwind CSS 3** — utility-first CSS framework untuk styling cepat dan konsisten tanpa meninggalkan JSX
- **SQLite 3 (sqlite3)** — database embedded tanpa setup server, data dalam satu file lokal, tanpa perlu internet
- **React Router DOM 7** — routing untuk memisahkan halaman Display dan Control dalam satu aplikasi React
- **IPC (contextBridge)** — pola komunikasi aman antara main process dan renderer process di Electron
- **HTML5 Audio API** — playback suara feedback dan timer tick tanpa library tambahan

---

## Screenshot

<table>
  <tr>
    <td align="center">
      <img src="screenshot/control panel_pengaturan skor.png" alt="Control Panel Pengaturan Skor" height="300">
      <br>
      <em>Control Panel Pengaturan Skor</em>
    </td>
    <td align="center">
      <img src="screenshot/control panel_pengaturan tampilan_1.png" alt="Control Panel Pengaturan Tampilan 1" height="300">
      <br>
      <em>Control Panel Pengaturan Tampilan 1</em>
    </td>
    <td align="center">
      <img src="screenshot/control panel_pengaturan tampilan_2.png" alt="Control Panel Pengaturan Tampilan 2" height="300">
      <br>
      <em>Control Panel Pengaturan Tampilan 2</em>
    </td>
  </tr>
</table>

---

## Panduan Build `.exe` (Windows)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Qidil/cerdas-cermat-scoreboard.git
cd cerdas-cermat-scoreboard
npm install
cd frontend && npm install && cd ..
npx @electron/rebuild
```

> **Catatan:** `@electron/rebuild` diperlukan untuk mengkompilasi ulang native module `sqlite3` agar cocok dengan versi Electron.

### 2. Build Vite (Frontend)

```bash
npm run build:vite
```

Hasilnya ada di `frontend/dist/`.

### 3. Package dengan electron-packager

```bash
npm run build:exe
```

Proses ini akan menghasilkan folder `release/Cerdas Cermat Scoreboard-win32-x64/`. Di dalamnya ada file `Cerdas Cermat Scoreboard.exe` yang bisa dijalankan langsung (portable, tanpa instalasi).

### 4. Struktur Output

```
release/
└── Cerdas Cermat Scoreboard-win32-x64/
    ├── Cerdas Cermat Scoreboard.exe   # ← Main executable
    ├── resources/
    │   └── app.asar                  # Aplikasi Electron
    ├── locales/                       # File bahasa
    ├── d3dcompiler_47.dll
    ├── ffmpeg.dll
    ├── icudtl.dat
    └── ...                            # DLL pendukung Electron
```

### Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `ERR_CONNECTION_REFUSED` saat dev | Vite belum siap, jalankan ulang `npm start` |
| `sqlite3` error | Jalankan `npx @electron/rebuild` |
| Window tidak muncul | Periksa DevTools di menu, cek Console untuk error |
| Database error | Hapus `score.db` di folder user data, lalu restart |

### Data User

Saat production (`.exe`), data aplikasi (database, backup, gambar) disimpan di:

- **Windows:** `C:\Users\<username>\AppData\Roaming\cerdas-cermat-scoreboard\`
- **Linux:** `~/.config/cerdas-cermat-scoreboard/`
- **macOS:** `~/Library/Application Support/cerdas-cermat-scoreboard/`

### Download Langsung

Alternatif, download `.exe` yang sudah jadi (Google Drive):
[Klik di sini](https://drive.google.com/drive/u/1/folders/1GyO5aDpVRsyr9xK_pBO4mlJ1T9vkCoLR)
