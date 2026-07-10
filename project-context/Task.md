# Task: Cerdas Cermat Scoreboard

> **Total Fase:** 3 | **Total Task:** 6 | **Terakhir diperbarui:** 10 Juli 2026

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
| 2 | Bug Fix | [ ] | 0/1 |
| 3 | Packaging (.exe) | [ ] | 0/1 |

---

## Fase 1: Kustomisasi Tampilan
> **Dependensi:** Tidak ada (fase pertama)
> **Tujuan:** Semua elemen tampilan Display bisa dikustomisasi dari Control Panel dan tersimpan persistent di database.

### Task 1.1: Database — Buat tabel `settings`
- **File:** `database.js`
- **Deskripsi:** Tambahkan `CREATE TABLE IF NOT EXISTS settings` untuk menyimpan pengaturan kustomisasi secara persistent.
- **Referensi:** `project-context/schema.md#tabel-settings-rencana--belum-ada-di-database`
- **Acceptance Criteria:**
  - [ ] Tabel `settings` dengan kolom `key TEXT PRIMARY KEY` dan `value TEXT` berhasil dibuat saat aplikasi dijalankan
  - [ ] Tabel dibuat otomatis di `database.js` tanpa perlu migrasi manual

### Task 1.2: Backend — IPC endpoints CRUD settings
- **File:** `main.js`, `preload.js`
- **Deskripsi:** Tambahkan IPC handler dan preload bridge untuk operasi CRUD tabel `settings` (getSetting, setSetting, getAllSettings, deleteSetting).
- **Referensi:** `project-context/api.md#ringkasan-channel`
- **Acceptance Criteria:**
  - [x] `electronAPI.getSetting(key)` mengembalikan nilai setting dari database
  - [x] `electronAPI.setSetting(key, value)` menyimpan/update nilai ke database
  - [x] `electronAPI.getAllSettings()` mengembalikan semua setting sebagai object
  - [x] `electronAPI.deleteSetting(key)` menghapus setting dari database
  - [x] Semua fungsi di-expose via `contextBridge` di `preload.js`

### Task 1.3: Frontend — Control Panel UI kustomisasi
- **File:** `frontend/src/App.jsx`
- **Deskripsi:** Tambahkan section baru di Control Panel untuk mengatur: header text, background logo (upload + opacity), background (warna solid atau gambar), sponsor logos, dan warna teks (header, tim, skor, timer, footer). Setiap perubahan langsung tersimpan ke database via IPC.
- **Referensi:** `project-context/PRD.md#51-kustomisasi-tampilan-persistent-via-database`, `project-context/StyleGuide.md`
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
- **Referensi:** `project-context/PRD.md#51-kustomisasi-tampilan-persistent-via-database`, `project-context/StyleGuide.md`
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
- **Referensi:** `project-context/PRD.md#52-bug-fix`, `project-context/rules.md#forbidden--larangan-teknis`
- **Acceptance Criteria:**
  - [ ] Timer tidak bocor (interval dibersihkan saat window ditutup)
  - [ ] Error database tidak membuat aplikasi crash (ada try-catch atau error handler)
  - [ ] Skor tidak bisa menjadi negatif tanpa batas (validasi jika diperlukan)
  - [ ] Feedback suara tidak tumpang tindih (sound reset sebelum play)
  - [ ] Tidak ada warning/error di console saat operasi normal

---

## Fase 3: Packaging (.exe)
> **Dependensi:** Fase 2 harus selesai
> **Tujuan:** Build aplikasi menjadi file `.exe` yang bisa dijalankan tanpa Node.js.

### Task 3.1: Setup electron-builder dan build .exe
- **File:** `package.json`, konfigurasi baru (electron-builder config)
- **Deskripsi:** Install dan konfigurasi electron-builder, atur build script, dan lakukan build pertama ke format .exe.
- **Referensi:** `project-context/architecture.md#packaging--build-ke-exe`
- **Acceptance Criteria:**
  - [ ] `npm run build` menghasilkan file `.exe` di folder `dist/`
  - [ ] Aplikasi bisa dijalankan dari `.exe` tanpa perlu Node.js atau npm
  - [ ] Semua fitur (display, control, database, kustomisasi) berfungsi di hasil build
  - [ ] Icon aplikasi terpasang (default atau kustom)
