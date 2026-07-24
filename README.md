# Cerdas Cermat Scoreboard

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat secara real-time dengan dual-window: **Display** (layar penonton) dan **Control Panel** (layar operator).

> ⚠️ **Status:** Tahap pengembangan aktif. Fitur kustomisasi tampilan sudah fungsional. Untuk membuat `.exe` distribusi sendiri, ikuti panduan di branch **[`exe-v1`](https://github.com/Qidil/cerdas-cermat-scoreboard/tree/exe-v1)**.

Scoreboard lomba cerdas cermat masih sering menggunakan metode manual (papan tulis, spidol, kertas) yang rawan kesalahan input, tidak real-time, dan menyulitkan panitia saat harus mengumumkan skor secara cepat. Aplikasi digital yang ada di pasaran umumnya berbasis web, membutuhkan koneksi internet, tidak bisa dikustomisasi untuk kebutuhan lomba tertentu, dan tampilannya terlalu umum.

Aplikasi ini ditujukan untuk panitia lomba cerdas cermat di sekolah, kampus, pesantren, atau instansi yang membutuhkan scoreboard digital profesional — real-time, mudah dioperasikan, dan bisa dikustomisasi tampilannya sesuai tema acara.

Cerdas Cermat Scoreboard menjawab semua masalah itu dengan menghadirkan aplikasi desktop dual-window yang bekerja sepenuhnya secara lokal tanpa perlu internet. Window Display menampilkan skor di layar penonton dengan animasi real-time, sementara Control Panel digunakan operator untuk mengatur skor, timer, dan kustomisasi tampilan. Aplikasi ini mendukung manajemen tim, timer countdown dengan suara, feedback visual & audio, backup data, serta kustomisasi penuh (header, warna, gambar background, logo, font sponsor) — semua tersimpan di database lokal.

---

## Key Features

- Manajemen tim (tambah/hapus tim)
- Skor real-time dengan animasi perubahan (+/-)
- Timer countdown dengan suara tick
- Feedback visual & suara (benar/salah)
- Backup & restore data match
- **Kustomisasi tampilan** (header, warna, gambar background, logo, font, sponsor)

---

## Challenge

Tantangan terbesar dalam pembuatan aplikasi ini:

1. **Dual-window architecture** — display dan control panel berjalan di dua window terpisah yang harus tetap sinkron real-time melalui IPC tanpa delay
2. **Native SQLite di Electron** — native module `sqlite3` harus di-rebuild ulang untuk setiap versi Electron
3. **Kustomisasi tampilan real-time** — gambar/font diupload sebagai base64 dan langsung dirender tanpa restart
4. **Distribusi .exe portable** — satu folder portable yang bisa jalan langsung dari flashdisk tanpa instalasi
5. **Distribusi file** — file .exe 212 MB melebihi batas 100 MB GitHub, distribusi via Google Drive

---

## Tech Choices

- **Electron** — platform desktop cross-platform dengan akses penuh ke file system, cocok untuk aplikasi lokal yang menyimpan data di disk
- **React** — library UI deklaratif untuk antarmuka reaktif real-time antara display dan control panel
- **Vite** — build tool cepat dengan Hot Module Replacement (HMR) yang mempercepat development
- **Tailwind CSS** — utility-first CSS framework untuk styling cepat dan konsisten tanpa meninggalkan JSX
- **SQLite (sqlite3)** — database embedded tanpa setup server, data dalam satu file lokal, tanpa perlu internet
- **React Router** — routing untuk memisahkan halaman Display dan Control dalam satu aplikasi React
- **IPC (contextBridge)** — pola komunikasi aman antara main process dan renderer process di Electron

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

## 🔮 Rencana

- Perbaikan startup timing (Vite + Electron)
