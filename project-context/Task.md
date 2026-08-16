# Task: Cerdas Cermat Scoreboard

> **Total Fase:** 7 | **Total Task:** 24 | **Terakhir diperbarui:** 16 Agustus 2026

## Aturan Eksekusi
- Kerjakan task **satu per satu** secara berurutan dalam satu fase.
- Setelah selesai satu **task**, **BERHENTI** dan tunggu konfirmasi user sebelum lanjut ke task berikutnya.
- Setelah selesai satu **fase** (semua task dalam fase), jalankan **kedua gate berurutan** (spec-compliance → code-review) secara otomatis tanpa konfirmasi per gate; perbaiki temuan lalu re-run gate.
- Konfirmasi user hanya wajib sebelum **commit / push ke GitHub**.
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
| 5 | Tab Panel + Soal Popup + Export PNG | [x] | 5/5 |
| 6 | Revisi Popup Soal | [x] | 4/4 |
| 7 | Kustomisasi Font & Ukuran Popup | [x] | 3/3 |

---

## Fase 7: Kustomisasi Font & Ukuran Popup
> **Dependensi:** Fase 6 selesai
> **Tujuan:** Tambah font custom per elemen (badge, soal, opsi) dan setting ukuran/posisi font & background untuk badge dan opsi jawaban di popup soal.

### Task 7.1: Font custom per elemen popup
- **File:** `frontend/src/App.jsx`, `project-context/schema.md`, `project-context/StyleGuide.md`
- **Deskripsi:** Tambah 3 setting font custom .ttf terpisah untuk badge tipe soal, teks soal, dan teks opsi jawaban. `popup_font` lama tetap sebagai fallback.
- **Traceability:** `REV-7.1`
- **Acceptance Criteria:**
  - [x] Badge tipe soal memakai font custom sendiri bila diisi
  - [x] Teks soal memakai font custom sendiri bila diisi
  - [x] Teks opsi jawaban memakai font custom sendiri bila diisi
  - [x] Bila font elemen kosong, fallback ke `popup_font`
  - [x] Setting tersimpan persistent dan diterapkan real-time

### Task 7.2: Setting ukuran font & background badge
- **File:** `frontend/src/App.jsx`, `project-context/schema.md`, `project-context/StyleGuide.md`
- **Deskripsi:** Tambah setting ukuran font badge (px), padding background badge X/Y (px), dan offset posisi badge X/Y (px).
- **Traceability:** `REV-7.2`
- **Acceptance Criteria:**
  - [x] Ukuran font badge bisa diatur (px)
  - [x] Padding background badge X/Y bisa diatur (px)
  - [x] Posisi badge X/Y bisa diatur (px)
  - [x] Setting tersimpan persistent dan diterapkan real-time

### Task 7.3: Setting ukuran font & background opsi jawaban
- **File:** `frontend/src/App.jsx`, `project-context/schema.md`, `project-context/StyleGuide.md`
- **Deskripsi:** Tambah setting ukuran font opsi (px), padding background opsi X/Y (px), dan offset posisi opsi X/Y (px).
- **Traceability:** `REV-7.3`
- **Acceptance Criteria:**
  - [x] Ukuran font opsi bisa diatur (px)
  - [x] Padding background opsi X/Y bisa diatur (px)
  - [x] Posisi opsi X/Y bisa diatur (px)
  - [x] Setting tersimpan persistent dan diterapkan real-time

---

## Fase 6: Revisi Popup Soal
> **Dependensi:** Fase 5 selesai
> **Tujuan:** Perbaikan popup soal berdasarkan feedback user: animasi muncul/tutup, posisi badge, warna+opacity badge & opsi, dan border+shadow popup.

### Task 6.1: Animasi popup muncul & tertutup
- **File:** `frontend/src/App.jsx`, `frontend/tailwind.config.js`
- **Deskripsi:** Tambah animasi transisi saat popup soal muncul di Display dan saat ditutup.
- **Traceability:** `REV-6.1`
- **Acceptance Criteria:**
  - [x] Popup muncul dengan animasi (bukan langsung tampil)
  - [x] Popup tertutup dengan animasi (bukan langsung hilang)
  - [x] Animasi tidak memblokir interaksi lain

### Task 6.2: Posisi badge tipe soal
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Pindahkan badge tipe soal (Pilihan Ganda / Isian / Benar-Salah) ke pojok kiri atas popup.
- **Traceability:** `REV-6.2`
- **Acceptance Criteria:**
  - [x] Badge berada di pojok kiri atas popup
  - [x] Teks badge tetap terbaca

### Task 6.3: Setting warna & opacity badge + opsi
- **File:** `frontend/src/App.jsx`, `project-context/schema.md`, `project-context/StyleGuide.md`
- **Deskripsi:** Tambah setting untuk warna background badge tipe soal dan background opsi jawaban, masing-masing dengan warna + opacity.
- **Traceability:** `REV-6.3`
- **Acceptance Criteria:**
  - [x] Warna background badge tipe soal bisa diatur (hex) + opacity
  - [x] Warna background opsi jawaban bisa diatur (hex) + opacity
  - [x] Setting tersimpan persistent di database
  - [x] Display menerapkan setting real-time

### Task 6.4: Setting border & shadow popup
- **File:** `frontend/src/App.jsx`, `project-context/schema.md`, `project-context/StyleGuide.md`
- **Deskripsi:** Tambah setting border popup (warna + ketebalan) dan opsi tampilkan/sembunyikan shadow.
- **Traceability:** `REV-6.4`
- **Acceptance Criteria:**
  - [x] Warna border popup bisa diatur (hex)
  - [x] Ketebalan border popup bisa diatur (px)
  - [x] Opsi tampilkan/sembunyikan shadow tersedia
  - [x] Setting tersimpan persistent dan diterapkan real-time

---

## Fase 5: Tab Panel + Soal Popup + Export PNG
> **Dependensi:** Fase 1-4 selesai
> **Tujuan:** Refactor Control Panel menjadi 4 tab (Operator, Soal, Tampilan, Histori), tambah popup soal di Display, dan fitur export gambar Display ke PNG.

### Task 5.1: Backend — IPC soal & export PNG
- **File:** `main.js`, `preload.js`
- **Deskripsi:** Tambah IPC handler untuk `show-question`, `hide-question`, dan `export-display-png` (capturePage + dialog save).
- **Referensi:** `project-context/api.md#10-soal-question-display`, `project-context/api.md#11-export-display-png`
- **Traceability:** `FEAT-5.1`
- **Acceptance Criteria:**
  - [x] `show-question` mengirim soal ke Display window
  - [x] `hide-question` mengirim perintah tutup popup ke Display window
  - [x] `export-display-png` mengambil screenshot Display saat itu dan menyimpan via dialog
  - [x] Semua fungsi baru di-expose via `contextBridge` di `preload.js`

### Task 5.2: Frontend — Tab structure Control Panel
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Refactor Control Panel menjadi 4 tab dengan navigasi di atas: Operator (TIM/SKOR/TIMER), Soal, Tampilan, Histori.
- **Referensi:** `project-context/PRD.md#48-tab-structure-control-panel`
- **Traceability:** `FEAT-5.2`
- **Acceptance Criteria:**
  - [x] 4 tab muncul dalam urutan: Operator, Soal, Tampilan, Histori
  - [x] Konten tab aktif saja yang dirender (tidak scroll panjang)
  - [x] Card TIM/SKOR/TIMER ada di tab Operator
  - [x] Pengaturan tampilan ada di tab Tampilan
  - [x] Save/Load match + history + export PNG ada di tab Histori

### Task 5.3: Frontend — Tab Soal (import JSON/CSV + popup)
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Buat tab Soal: upload file .json/.csv, parse ke struktur internal, daftar soal, klik soal untuk toggle popup di Display.
- **Referensi:** `project-context/improvement.md#3-tab-soal--popup-soal-di-display-fitur-baru`
- **Traceability:** `FEAT-5.3`
- **Acceptance Criteria:**
  - [x] Upload file .json dan .csv didukung (CSV dikonversi ke JSON internal)
  - [x] CSV memakai kolom: `type,question,option_a,option_b,option_c,option_d,answer`
  - [x] 3 tipe soal dirender benar: pilihan ganda, isian, benar/salah
  - [x] Klik soal → popup muncul di Display; klik lagi → popup hilang
  - [x] Klik soal lain saat popup aktif → konten popup berganti

### Task 5.4: Frontend — Popup soal di Display
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Display menerima event `show-question`/`hide-question`, menampilkan popup soal dengan pengaturan dari settings.
- **Referensi:** `project-context/improvement.md#3-tab-soal--popup-soal-di-display-fitur-baru`
- **Traceability:** `FEAT-5.4`
- **Acceptance Criteria:**
  - [x] Popup menampilkan soal besar dan terbaca dari jauh
  - [x] Pilihan ganda menampilkan opsi A/B/C/D; isian & benar/salah hanya teks soal
  - [x] Ukuran, font, warna, background popup mengikuti settings
  - [x] Jawaban tidak pernah ditampilkan di Display
  - [x] Soal hilang total dari DOM saat ditutup (bukan hanya CSS hidden)

### Task 5.5: Frontend — Setting popup di tab Tampilan + Export PNG di tab Histori
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Tambah pengaturan popup soal (ukuran, font, warna, background) di tab Tampilan. Tambah tombol export PNG di tab Histori.
- **Referensi:** `project-context/improvement.md#3-tab-soal--popup-soal-di-display-fitur-baru`
- **Traceability:** `FEAT-5.5`
- **Acceptance Criteria:**
  - [x] Tab Tampilan punya setting ukuran popup (w/h px)
  - [x] Tab Tampilan punya setting font & ukuran font popup + warna teks
  - [x] Tab Tampilan punya setting background popup (warna solid / gambar)
  - [x] Tab Histori punya tombol export PNG yang memanggil `exportDisplayPng()`
  - [x] Export berhasil menyimpan gambar tampilan Display saat itu

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
