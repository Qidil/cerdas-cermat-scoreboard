# Improvement Log

> Catatan semua perubahan yang pernah terjadi pada proyek dan rencana fitur baru.
> Dokumen ini bersifat **kronologi**: terbaru di bawah, konteks historis tetap dipertahankan.

## Daftar Isi

1. [Riwayat Perubahan](#riwayat-perubahan)
2. [Fitur Baru yang Direncanakan (Rapat)](#fitur-baru-yang-direncanakan-rapat)

---

## Riwayat Perubahan

### 2026-04-02 — Inisiasi Setup
- Setup awal Electron + React + Vite + SQLite (`3d0cfc9`, `483d9d2`)
- Struktur dasar: `main.js` (main process), `preload.js` (bridge), `database.js` (SQLite), `frontend/` (React)

### 2026-04-07 — Tes IPC & Tambah Tim
- Tes channel IPC Electron (`6488dbd`)
- Fitur tambah tim (`d366a1a`) — ditemukan bug: tim tidak hilang saat dijalankan kembali

### 2026-04-09 — Skor & Tim
- Tambah/kurangi skor per tim, hapus tim + konfirmasi (`1d44009`)
- Tombol BENAR/SALAH, notifikasi tambah/kurang skor (`1fd12b2`)

### 2026-04-20 — History & Match
- Undo skor (`56c871b`), history + undo di Control (`b03eacd`)
- Simpan data match ke perangkat + load rollback full (`6634ad8`)
- README dibuat (`1b9a9bb`, `2f2383f`)

### 2026-04-26 — Timer & Cleanup
- Fitur timer ditambahkan (`8d83156`)
- Fitur undo dihapus (`2aa8da6`)

### 2026-05-01 — Suara & UI
- Penambahan sound (correct, wrong, tick) (`8f8abbf`)
- Update UI sementara pakai Tailwind CSS (`e70e703`)

### 2026-07-10 — Fase 2: Kustomisasi Tampilan
- Kustomisasi tampilan lengkap: background (warna/gambar), logo background, sponsor, font custom, warna teks, ukuran teks, posisi teks, ketebalan teks, hide sponsor (`ce91a7c`)
- Bug fix CORS & sponsor, tombol hapus per item
- Docs update

### 2026-07-17 — README Update
- Update isi README (`381ba77`)

### 2026-07-24 — Revisi Folder Project
- Revisi isi folder project & README (`18369ff`, `1be70cd`, `3d683de`, `ad89835`, `ad06c9f`)
- Branch `exe-v1` dibuat untuk panduan build .exe

### 2026-07-30 — Update v2 & Bug Fix
- Update v2 (`ebd0f1d`), bug-fix dikit (`4704fa8`)
- Branch `exe-v1` dihapus total (remote + local)
- README diperbarui: fitur lengkap, panduan build exe step-by-step, link Google Drive
- Semua dokumen `project-context/` diperbarui sesuai kondisi kode terakhir (`4c319f6`)

### 2026-07-30 — Perbaikan Build Exe
- **Bug**: exe error saat dijalankan karena `node_modules` (termasuk `sqlite3`) tidak ikut ter-bundle
- **Penyebab**: flag `--ignore="node_modules"` di script `build:exe` mengabaikan seluruh folder node_modules
- **Fix**: hapus `--ignore="node_modules"` dari `package.json` — `--prune=true` sudah otomatis memisahkan devDependencies, menyisakan `sqlite3` (dependency runtime)
- Hasil: exe berjalan normal, `node_modules/sqlite3` ter-bundle dengan benar (`6f907e7`)

### 2026-08-16 — Fase 5: Tab Panel + Soal Popup + Export PNG

**Implementasi tuntas (belum di-commit/push, menunggu verifikasi user):**
- Control Panel di-refactor menjadi 4 tab: **Operator → Soal → Tampilan → Histori**
- **Tab Soal** (baru): upload file `.json`/`.csv`, daftar soal dengan tombol Tampilkan/Tutup, popup soal dikirim ke Display hanya saat aktif
- **Popup soal di Display**: tipe pilihan_ganda (opsi A-D), isian, benar/salah — jawaban **tidak pernah dirender**
- **Tab Tampilan**: semua pengaturan lama + pengaturan popup baru (lebar/tinggi, ukuran font, font custom .ttf, warna teks/opsi, background solid/gambar)
- **Tab Histori**: history + save/load match (lama) + tombol **Export PNG** baru (`capturePage` + `dialog.showSaveDialog`)
- Badge tipe soal (Pilihan Ganda / Isian / Benar-Salah) di pojok kiri atas popup
- Ukuran popup dibatasi (max 100% lebar/tinggi layar Display)
- Field `answer` di-strip di `main.js` sebelum soal dikirim ke Display

**File contoh soal:** `contoh-soal/soal-contoh.csv` (10 pilihan ganda, 10 isian, 10 benar/salah)

### 2026-08-16 — Fase 6: Revisi Popup Soal

**Revisi berdasarkan feedback user (belum di-commit/push):**
- **Animasi popup**: popup muncul dengan fade-in + scale (`popup-in`, 0.25s) dan tertutup dengan fade-out (`popup-out`, 0.2s) — animasi tutup ditunda 200ms sebelum unmount agar transisi terlihat
- **Posisi badge**: badge tipe soal dipindah ke pojok kiri atas popup (sebelumnya di tengah atas)
- **Setting baru badge & opsi**: `popup_badge_bg_color` + `popup_badge_opacity`, `popup_option_bg_color` + `popup_option_bg_opacity` — warna & opacity background bisa diatur dari tab Tampilan
- **Setting baru border & shadow**: `popup_border_color`, `popup_border_width`, `popup_shadow` — warna & ketebalan border popup bisa diatur, shadow bisa ditampilkan/disembunyikan

> Status: **SUDAH dieksekusi** (16 Agustus 2026) — implementasi Fase 5 & 6 tuntas di kode.
> Catatan rapat: 16 Agustus 2026. Styleguide & komponen memakai skill yang tersedia + shadcn MCP.
> Hasil code review diterapkan: tutup popup saat ganti file soal, batasi ukuran popup ke layar, badge tipe soal di popup, field jawaban di-strip sebelum dikirim ke Display.

### 2026-08-16 — Fase 7: Kustomisasi Font & Ukuran Popup (SUDAH DIEKSEKUSI)

**Rancangan revisi yang diterapkan:**
- **Font custom per elemen**: `popup_font_badge`, `popup_font_question`, `popup_font_option` — font .ttf terpisah untuk badge, teks soal, teks opsi; `popup_font` lama jadi fallback
- **Badge tipe soal**: `popup_badge_font_size` (14), `popup_badge_bg_padding_x` (12), `popup_badge_bg_padding_y` (4), `popup_badge_pos_x` (0), `popup_badge_pos_y` (0)
- **Opsi jawaban**: `popup_option_font_size` (20), `popup_option_bg_padding_x` (24), `popup_option_bg_padding_y` (12), `popup_option_pos_x` (0), `popup_option_pos_y` (0)
- Ukuran/posisi mengikuti pola elemen teks Display lain (`font_size_*`, `pos_*_x/y`)
- Implementasi: 13 state + load `getAllSettings` + switch `onSettingsUpdate` + render di Display; 13 input UI di Control; 3 font baru (`CerdasPopupBadge`/`CerdasPopupQuestion`/`CerdasPopupOption`) dengan fallback `CerdasPopup`

---

### 1. Tab Structure di Control Panel

**Tujuan:** Mengganti layout Control Panel yang panjang (scroll jauh ke bawah) menjadi tab-based.

**Urutan tab (final sesuai revisi):**
1. **Operator** — berisi kegiatan operasional lomba: TIM (tambah/hapus tim), SKOR (feedback benar/salah, tambah/kurang skor), TIMER
2. **Soal** — (baru) kelola & tampilkan soal ke Display
3. **Tampilan** — berisi semua pengaturan tampilan Display (yang saat ini di card TAMPILAN; sebelumnya bernama "Edit Tampilan", dipindah ke setelah tab Soal)
4. **Histori** — (baru) history + save/load match + export gambar

**Detail:**
- Navigasi tab di bagian atas Control Panel
- Konten hanya tab aktif yang dirender (tidak perlu scroll jauh)
- Ganti `showSettings` (collapsible card TAMPILAN) menjadi tab tersendiri

### 2. Tab Operator

**Isi:** Menggabungkan card TIM, SKOR, TIMER yang sekarang (tetap seperti sekarang, hanya dipindah ke tab Operator).

### 3. Tab Soal — Popup Soal di Display (FITUR BARU)

**Tujuan:** Operator menampilkan soal ke layar Display sebagai popup, dan bisa menutupnya kembali.

**Alur:**
1. Operator **load file soal** dari tab Soal (format file: **JSON** rekomendasi, CSV sebagai alternatif — lihat Still Open)
2. Setelah load, daftar soal muncul di tab Soal
3. Operator **klik satu soal** → soal tampil sebagai **popup di Display**
4. Operator **klik lagi** soal yang sama → popup tertutup
5. Satu soal aktif pada satu waktu (klik soal lain saat ada popup = ganti konten popup)

**3 Tipe soal yang didukung:**
- **Pilihan Ganda** (multiple choice) — tampilkan opsi A/B/C/D
- **Isian** (fill-in) — teks pertanyaan saja
- **Benar/Salah** (true/false)

**Format import (final):** JSON **dan** CSV didukung — CSV dikonversi ke struktur JSON internal agar mudah dibaca mesin.

**Format JSON internal:**
```json
{
  "soal": [
    { "type": "pilihan_ganda", "question": "...", "options": ["A", "B", "C", "D"], "answer": "B" },
    { "type": "isian", "question": "...", "answer": "..." },
    { "type": "benar_salah", "question": "...", "answer": "benar" }
  ]
}
```

**Format CSV (dikonversi ke JSON):**
- Kolom: `type,question,option_a,option_b,option_c,option_d,answer`
- Tipe: `pilihan_ganda`, `isian`, `benar_salah`
- Jawaban **tidak wajib diisi** (user tidak berencana memasukkan jawaban ke file .csv) — kolom `answer` boleh kosong

**Keputusan final:** Jawaban **tidak ditampilkan** di popup Display — popup hanya menampilkan pertanyaan (dan opsi untuk pilihan ganda). Jawaban hanya ada di data, untuk referensi juri.

**Pengaturan popup (dari tab Edit Tampilan):**
- Ukuran popup (lebar/tinggi, dalam px)
- Ukuran font & jenis font (custom .ttf seperti elemen lain)
- Warna teks
- Background popup: gambar (upload) atau warna solid
- (Tambahan yang mungkin) posisi popup

**Keamanan (catatan @Ikhsan):**
- Soal dikirim ke Display **hanya saat ditampilkan** (bukan semua soal di-broadcast)
- State soal benar-benar dihapus dari DOM Display saat popup ditutup
- Soal tidak bocor ke layar Display sebelum popup aktif

### 4. Tab Histori — History + Save/Load + Export Gambar

**Tujuan:** Fitur yang sekarang tersebar di card DATA, dipindah jadi tab tersendiri.

**Isi:**
- **History** — daftar aktivitas (seperti sekarang: tambah tim, hapus tim, +skor, -skor)
- **Save / Load Match** — simpan data match (backup) & load rollback (seperti sekarang)
- **Export gambar Display ke PNG** (FITUR BARU):
  - Menangkap tampilan Display **pada saat itu** (skor, timer, sponsor, dsb — apa yang terlihat)
  - Teknologi: `webContents.capturePage()` di Electron + simpan ke file PNG
  - Lokasi simpan: menunggu keputusan (dialog folder via `dialog.showSaveDialog`, atau ke folder data app)

---

## Still Open (menunggu keputusan user sebelum eksekusi)

1. **Format import soal**: ~~JSON / CSV~~ → **KEPUTUSAN: JSON + CSV** (CSV dikonversi ke JSON internal)
2. **Export PNG**: ~~dialog / folder data~~ → **KEPUTUSAN: Dialog pilih folder** (`dialog.showSaveDialog`)
3. **Popup soal jawaban**: ~~tidak / ya / toggle~~ → **KEPUTUSAN: Hanya soal** (jawaban tidak ditampilkan di Display)
4. **Struktur tab**: urutan final → Operator → Soal → Tampilan → Histori; nama tab "Tampilan" (bukan "Edit Tampilan") — **konfirmasi**
5. **Eksekusi implementasi**: menunggu konfirmasi user (belum dieksekusi)
