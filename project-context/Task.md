# Task: Cerdas Cermat Scoreboard

> **Total Fase:** 4 | **Total Task:** 12 | **Terakhir diperbarui:** 30 Juli 2026

## Aturan Eksekusi
- Kerjakan task **satu per satu** secara berurutan dalam satu fase.
- Setelah selesai satu **task**, **BERHENTI** dan tunggu konfirmasi user sebelum lanjut ke task berikutnya.
- Update status `[ ]` menjadi `[x]` saat task selesai.
- Jika task terblokir, tandai dengan `[~]` dan catat alasannya.

---

## Progress Overview
| Fase | Nama | Status | Progress |
|------|------|--------|----------|
| 1 | Kustomisasi Tampilan | [x] | 4/4 |
| 2 | Bug Fix | [x] | 1/1 |
| 3 | Packaging (.exe) | [x] | 1/1 |
| 4 | UI/UX Enhancement | [x] | 6/6 |

---

## Fase 1: Kustomisasi Tampilan
> **Dependensi:** Tidak ada (fase pertama)
> **Tujuan:** Semua elemen tampilan Display bisa dikustomisasi dari Control Panel dan tersimpan persistent di database.

### Task 1.1: Database — Buat tabel `settings`
- **File:** `database.js`
- **Deskripsi:** Tambahkan `CREATE TABLE IF NOT EXISTS settings` untuk menyimpan pengaturan kustomisasi secara persistent.
- **Referensi:** `project-context/schema.md#tabel-settings`
- **Acceptance Criteria:**
  - [x] Tabel `settings` dengan kolom `key TEXT PRIMARY KEY` dan `value TEXT` berhasil dibuat saat aplikasi dijalankan
  - [x] Tabel dibuat otomatis di `database.js` tanpa perlu migrasi manual

### Task 1.2: Backend — IPC endpoints CRUD settings
- **File:** `main.js`, `preload.js`
- **Deskripsi:** Tambahkan IPC handler dan preload bridge untuk operasi CRUD tabel `settings` (getSetting, setSetting, getAllSettings, deleteSetting).
- **Referensi:** `project-context/api.md#8-settings-management-crud`
- **Acceptance Criteria:**
  - [x] `electronAPI.getSetting(key)` mengembalikan nilai setting dari database
  - [x] `electronAPI.setSetting(key, value)` menyimpan/update nilai ke database
  - [x] `electronAPI.getAllSettings()` mengembalikan semua setting sebagai object
  - [x] `electronAPI.deleteSetting(key)` menghapus setting dari database
  - [x] Semua fungsi di-expose via `contextBridge` di `preload.js`

### Task 1.3: Frontend — Control Panel UI kustomisasi
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Tambahkan section baru di Control Panel untuk mengatur: header text, background logo (upload + opacity), background (warna solid atau gambar), sponsor logos, dan warna teks (header, tim, skor, timer, footer). Setiap perubahan langsung tersimpan ke database via IPC.
- **Referensi:** `project-context/PRD.md#46-kustomisasi-tampilan-persistent-via-database`
- **Acceptance Criteria:**
  - [x] Ada form input untuk mengubah header text
  - [x] Ada upload button untuk background logo + slider opacity
  - [x] Ada opsi pilih background: warna solid (color picker) atau upload gambar
  - [x] Ada form untuk menambah/mengubah/menghapus logo sponsor
  - [x] Ada color picker untuk warna teks: header, nama tim, skor, timer, footer
  - [x] Semua perubahan langsung tersimpan ke database

### Task 1.4: Frontend — Display menerapkan kustomisasi
- **File:** `frontend/src/App.jsx` (Display component)
- **Deskripsi:** Display component membaca semua pengaturan dari database saat startup (via IPC) dan menerapkannya ke elemen tampilan (header text, background, logo, warna teks, sponsor).
- **Referensi:** `project-context/PRD.md#46-kustomisasi-tampilan-persistent-via-database`
- **Acceptance Criteria:**
  - [x] Header menampilkan text dari settings (bukan hardcoded "LOMBA CERDAS CERMAT")
  - [x] Background menampilkan warna/gambar dari settings
  - [x] Logo background tampil dengan opacity dari settings
  - [x] Logo sponsor tampil sesuai data dari settings
  - [x] Warna teks header, tim, skor, timer, footer sesuai settings
  - [x] Semua perubahan diterapkan real-time saat diubah dari Control Panel

---

## Fase 2: Bug Fix
> **Dependensi:** Fase 1 harus selesai
> **Tujuan:** Identifikasi dan perbaiki bug yang ada di codebase.

### Task 2.1: Identifikasi dan perbaiki bug
- **File:** `main.js`, `frontend/src/App.jsx`, `database.js`, dan file terkait
- **Deskripsi:** Cek dan perbaiki bug yang ada, meliputi: error handling, memory leak (timer interval), inconsistency skor, edge case timer, dan bug lain yang terdeteksi.
- **Referensi:** `project-context/rules.md#forbidden--larangan-teknis`
- **Acceptance Criteria:**
  - [x] Timer tidak bocor (interval dibersihkan saat app ditutup / timer di-reset)
  - [x] Error database tidak membuat aplikasi crash (ada try-catch atau error handler dan broadcast `operation-error`)
  - [x] Skor tidak bisa menjadi negatif (ada validasi guard `if (type === 'minus' && team.score - value < 0)`)
  - [x] Feedback suara tidak tumpang tindih (sound di-reset via `audioRef.current.pause()` + `currentTime = 0` sebelum play)
  - [x] Tidak ada warning/error di console saat operasi normal

---

## Fase 3: Packaging (.exe)
> **Dependensi:** Fase 2 harus selesai
> **Tujuan:** Build aplikasi menjadi file `.exe` yang bisa dijalankan tanpa Node.js.

### Task 3.1: Setup electron-packager dan build .exe
- **File:** `package.json`
- **Deskripsi:** Tambahkan script build, konfigurasi electron-packager, dan lakukan build.
- **Referensi:** `project-context/architecture.md#packaging--build-ke-exe`
- **Acceptance Criteria:**
  - [x] `npm run build:vite` menghasilkan build frontend di `frontend/dist/`
  - [x] `npm run build:exe` menghasilkan folder portable di `release/`
  - [x] Aplikasi bisa dijalankan dari `.exe` tanpa perlu Node.js atau npm
  - [x] Semua fitur (display, control, database, kustomisasi) berfungsi di hasil build

---

## Fase 4: UI/UX Enhancement
> **Dependensi:** Fase 1-3 selesai
> **Tujuan:** Menambahkan kontrol ukuran teks, posisi teks, ketebalan font, hide sponsor, feedback SVG, window title, favicon, dan redesign Control Panel.

### Task 4.1: Ukuran & Posisi Teks
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Tambah input number untuk ukuran teks per elemen (header, nama tim, skor, timer, footer) dan input number untuk offset X/Y posisi + gap tim.
- **Acceptance Criteria:**
  - [x] Masing-masing elemen punya input ukuran (min=1, tanpa batas atas)
  - [x] Masing-masing elemen punya input offset X dan Y
  - [x] Gap tim bisa diatur via input number
  - [x] Semua perubahan tersimpan real-time ke database

### Task 4.2: Font Bold/Reguler Toggle
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Tambah dropdown bold/reguler untuk masing-masing elemen teks.
- **Acceptance Criteria:**
  - [x] Dropdown select Bold/Reguler untuk header, nama tim, skor, timer, footer
  - [x] Tersimpan di database dan diterapkan di Display

### Task 4.3: Hide Sponsor & Empty Header
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Tambah toggle hide sponsor dan hapus fallback teks header.
- **Acceptance Criteria:**
  - [x] Checkbox hide sponsor menyembunyikan footer sponsor di Display
  - [x] Header kosong tidak menampilkan teks default

### Task 4.4: Feedback SVG & Window Title
- **File:** `frontend/src/App.jsx`, `main.js`
- **Deskripsi:** Ganti Unicode feedback dengan SVG centang/X, tambah window title masing-masing jendela.
- **Acceptance Criteria:**
  - [x] Feedback benar = SVG centang putih tanpa lingkaran
  - [x] Feedback salah = SVG huruf X putih tanpa lingkaran
  - [x] SVG diperbesar hampir fullscreen (`70vh`)
  - [x] Window title Display = "Display", Control Panel = "Control Panel"

### Task 4.5: Favicon/Logo
- **File:** `frontend/public/favicon.svg`, `frontend/public/favicon.ico`, `main.js`, `frontend/index.html`
- **Deskripsi:** Update favicon SVG, generate .ico untuk icon jendela Electron.
- **Acceptance Criteria:**
  - [x] favicon.svg berisi ikon "CC"
  - [x] favicon.ico tersedia untuk BrowserWindow icon
  - [x] Index.html title "Cerdas Cermat Scoreboard"

### Task 4.6: Redesign Control Panel
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Redesign tata letak Control Panel menjadi card-based per fungsi.
- **Acceptance Criteria:**
  - [x] Card TIM (add team, team list)
  - [x] Card SKOR (feedback button, score controls)
  - [x] Card TIMER (timer controls)
  - [x] Card DATA (save, load, history)
  - [x] Card TAMPILAN (collapsible, semua settings)
