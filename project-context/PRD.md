# PRD — Product Requirements Document

> Didokumentasikan dari codebase yang sudah ada (spec-init).

## 1. Visi Produk

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat (dan sejenisnya) secara real-time dengan dual-window: satu layar display untuk penonton, satu panel kontrol untuk operator.

## 2. Target Pengguna

- Penyelenggara lomba cerdas cermat
- Operator yang mengontrol skor di belakang layar
- Penonton yang melihat scoreboard di layar utama

## 3. Platform

- **Desktop** (Windows via Electron)
- Saat ini berjalan di development mode (Vite dev server + Electron)
- **Target distribusi:** File `.exe` untuk Windows (via electron-builder atau electron-forge)
- Aplikasi harus bisa dijalankan langsung tanpa perlu install Node.js atau npm

## 4. Fitur yang Sudah Dibangun

### 4.1 Manajemen Tim
| Fitur | Detail |
|---|---|
| Tambah tim | Input nama tim → INSERT ke database |
| Hapus tim | Hapus tim dari database (dengan konfirmasi) |
| Lihat daftar tim | Tampil di kedua window secara real-time |

### 4.2 Manajemen Skor
| Fitur | Detail |
|---|---|
| Tambah skor | Pilih tim + nilai → UPDATE skor |
| Kurangi skor | Pilih tim + nilai → UPDATE skor |
| Animasi perubahan | Pop-up angka hijau (+) / merah (-) di Display |
| Riwayat perubahan | Log semua perubahan skor di Control Panel (20 record terbaru) |

### 4.3 Feedback Jawaban
| Fitur | Detail |
|---|---|
| Tombol BENAR | Overlay hijau + suara `correct.mp3` di Display |
| Tombol SALAH | Overlay merah + suara `wrong.mp3` di Display |

### 4.4 Timer
| Fitur | Detail |
|---|---|
| Start timer | Input detik → countdown di Display dengan animasi pulse |
| Pause timer | Hentikan countdown |
| Resume timer | Lanjutkan countdown |
| Reset timer | Hentikan + sembunyikan timer |
| Suara tick | Bunyi tiap detik saat timer berjalan |

### 4.5 Backup & Restore
| Fitur | Detail |
|---|---|
| Simpan match | Backup data teams + history ke file JSON di `backups/` |
| Load match | Restore data dari file backup |

## 5. Fitur yang Direncanakan (Belum Dibangun)

### 5.1 Kustomisasi Tampilan (Persistent via Database)
| Fitur | Detail |
|---|---|
| Header text | Tulisan header bisa diubah dari Control Panel |
| Background logo | Upload logo dengan opacity bisa diatur |
| Background | Bisa pilih warna solid atau gambar/foto |
| Sponsor logos | Logo sponsor bisa ditambah/diubah lewat Control Panel |
| Warna teks | Warna header, nama tim, skor, timer, dan footer bisa diganti |
| Font kustom | Font .ttf untuk header, nama tim, skor, timer, dan footer bisa diupload per elemen |
| Penyimpanan | Semua pengaturan tersimpan di database (tidak perlu setel ulang) |

### 5.2 Bug Fix
- Masih ada beberapa bug yang perlu dicek dan diperbaiki

## 6. Business Rules

| No | Rule | Detail |
|---|---|---|
| BR-01 | Nama tim harus unik | Constraint `UNIQUE` di tabel `teams` |
| BR-02 | Skor default tim adalah 0 | `DEFAULT 0` di kolom `score` |
| BR-03 | Penghapusan tim dicatat di history | INSERT history dengan action `delete-team` sebelum DELETE |
| BR-04 | History tidak bisa dihapus | Tidak ada endpoint delete history |
| BR-05 | Backup menyimpan semua data | Teams + history lengkap, bukan hanya snapshot skor |
| BR-06 | Timer tidak bisa di-resume jika sudah habis | Guard `if (currentTime <= 0) return` |
| BR-07 | Display hanya menampilkan | Tidak ada interaksi user di Display window |

## 7. Non-Goals

| No | Non-Goal | Alasan |
|---|---|---|
| NG-01 | Tidak ada autentikasi / login | Aplikasi lokal desktop, satu operator |
| NG-02 | Tidak ada jaringan / multiplayer | Hanya satu mesin |
| NG-03 | Tidak ada export PDF / print | Belum diperlukan |
| NG-04 | Tidak ada multiple match dalam satu sesi | Match dimulai dari keadaan kosong |
| NG-05 | Tidak ada undo terpisah | History bisa dilihat, tapi tidak bisa rollback otomatis |

## 8. Struktur Halaman

| Route | Halaman | Fungsi |
|---|---|---|
| `/` | Redirect ke `/control` | Default |
| `/display` | Display Scoreboard | Layar penonton |
| `/control` | Control Panel | Layar operator |

## 9. Dependency Eksternal

| Library | Fungsi |
|---|---|
| `electron` | Desktop framework |
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Routing |
| `vite` | Bundler & dev server |
| `tailwindcss` | CSS framework |
| `sqlite3` | Database |

> ⚠️ **Perlu verifikasi:** Apakah ada fitur lain yang belum tercantum di sini?
> ⚠️ **Perlu verifikasi:** Apakah prioritas fitur kustomisasi vs bug fix sudah sesuai?
