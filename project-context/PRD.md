# PRD — Product Requirements Document

> Didokumentasikan dari codebase yang sudah ada (spec-init) — diperbarui 30 Juli 2026.

## 1. Visi Produk

Aplikasi desktop untuk menampilkan skor lomba cerdas cermat (dan sejenisnya) secara real-time dengan dual-window: satu layar display untuk penonton, satu panel kontrol untuk operator.

## 2. Target Pengguna

- Penyelenggara lomba cerdas cermat
- Operator yang mengontrol skor di belakang layar
- Penonton yang melihat scoreboard di layar utama

## 3. Platform

- **Desktop** (Windows via Electron)
- Saat ini berjalan di development mode (Vite dev server + Electron) maupun production (.exe)
- **Distribusi:** Folder portable via `electron-packager` — satu folder bisa jalan langsung tanpa instalasi
- Aplikasi bisa dijalankan langsung tanpa perlu install Node.js atau npm

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
| Kurangi skor | Pilih tim + nilai → UPDATE skor, dengan validasi skor tidak negatif |
| Animasi perubahan | Pop-up angka hijau (+) / merah (-) di Display |
| Riwayat perubahan | Log semua perubahan skor di Control Panel (20 record terbaru) |

### 4.3 Feedback Jawaban
| Fitur | Detail |
|---|---|
| Tombol BENAR | Overlay hijau + SVG centang putih 70vh + suara `correct.mp3` di Display |
| Tombol SALAH | Overlay merah + SVG huruf X putih 70vh + suara `wrong.mp3` di Display |

### 4.4 Timer
| Fitur | Detail |
|---|---|
| Start timer | Input detik → countdown di Display dengan animasi pulse |
| Pause timer | Hentikan countdown |
| Resume timer | Lanjutkan countdown |
| Reset timer | Hentikan + sembunyikan timer |
| Suara tick | Bunyi tiap detik saat timer berjalan via `tick.mp3` |

### 4.5 Backup & Restore
| Fitur | Detail |
|---|---|
| Simpan match | Backup data teams + history ke file JSON di `backups/` |
| Load match | Restore data dari file backup |

### 4.6 Kustomisasi Tampilan (Persistent via Database)
| Fitur | Detail |
|---|---|
| Header text | Tulisan header bisa diubah dari Control Panel |
| Background logo | Upload logo dengan opacity bisa diatur (0-100%) |
| Background | Bisa pilih warna solid (color picker) atau upload gambar |
| Sponsor logos | Logo sponsor bisa ditambah/dihapus lewat Control Panel, dengan hide toggle |
| Warna teks | Warna header, nama tim, skor, timer, dan footer bisa diganti masing-masing |
| Font kustom | Font .ttf untuk header, nama tim, skor, timer, dan footer bisa diupload per elemen |
| Ukuran font | Input number (min=1, tanpa batas atas) per elemen |
| Posisi teks | Input offset X/Y dalam px per elemen + gap antar tim |
| Bold/Reguler | Toggle per elemen (header, nama tim, skor, timer, footer) |
| Penyimpanan | Semua pengaturan tersimpan di database (tidak perlu setel ulang) |

### 4.7 UI/UX Enhancement
| Fitur | Detail |
|---|---|
| Redesign Control Panel | Tata letak card-based: TIM, SKOR, TIMER, DATA, TAMPILAN (collapsible) |
| Window title | Display window title "Display", Control Panel title "Control Panel" |
| Favicon | Ikon "CC" di taskbar via `favicon.ico` + `favicon.svg` untuk browser |

## 5. Business Rules

| No | Rule | Detail |
|---|---|---|
| BR-01 | Nama tim harus unik | Constraint `UNIQUE` di tabel `teams` |
| BR-02 | Skor default tim adalah 0 | `DEFAULT 0` di kolom `score` |
| BR-03 | Penghapusan tim dicatat di history | INSERT history dengan action `delete-team` sebelum DELETE |
| BR-04 | History tidak bisa dihapus | Tidak ada endpoint delete history |
| BR-05 | Backup menyimpan semua data | Teams + history lengkap, bukan hanya snapshot skor |
| BR-06 | Timer tidak bisa di-resume jika sudah habis | Guard `if (currentTime <= 0) return` |
| BR-07 | Display hanya menampilkan | Tidak ada interaksi user di Display window |
| BR-08 | Skor tidak boleh negatif | Validasi `if (type === 'minus' && team.score - value < 0)` |
| BR-09 | Feedback suara tidak tumpang tindih | Sound di-reset sebelum play via `audioRef.current.pause()` + `currentTime = 0` |

## 6. Non-Goals

| No | Non-Goal | Alasan |
|---|---|---|
| NG-01 | Tidak ada autentikasi / login | Aplikasi lokal desktop, satu operator |
| NG-02 | Tidak ada jaringan / multiplayer | Hanya satu mesin |
| NG-03 | Tidak ada export PDF / print | Belum diperlukan |
| NG-04 | Tidak ada multiple match dalam satu sesi | Match dimulai dari keadaan kosong |
| NG-05 | Tidak ada undo terpisah | History bisa dilihat, tapi tidak bisa rollback otomatis |

## 7. Struktur Halaman

| Route | Halaman | Fungsi |
|---|---|---|
| `/` | Redirect ke `/control` | Default |
| `/display` | Display Scoreboard | Layar penonton |
| `/control` | Control Panel | Layar operator |

Catatan: Menggunakan `HashRouter` (bukan `BrowserRouter`) agar kompatibel dengan production build via `electron-packager`.

## 8. Dependency Eksternal

| Library | Fungsi |
|---|---|
| `electron` 41 | Desktop framework |
| `react` 19 + `react-dom` | UI framework |
| `react-router-dom` 7 | Routing |
| `vite` 8 | Bundler & dev server |
| `tailwindcss` 3 | CSS framework |
| `sqlite3` (native addon) | Database |
| `electron-packager` | Build .exe distribusi |
| `@electron/rebuild` | Rebuild native module untuk Electron |
| `concurrently` | Menjalankan Vite + Electron bersamaan (dev only) |
