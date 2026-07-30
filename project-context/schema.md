# Schema — Model Data

> Didokumentasikan dari codebase yang sudah ada (spec-init) — diperbarui 30 Juli 2026.

## Database Engine

- **Engine:** SQLite 3
- **Library:** `sqlite3` (npm native addon — perlu `@electron/rebuild`)
- **File:** `score.db` (root project saat dev, `userData` saat production, gitignored)
- **Inisialisasi:** `database.js`

---

## Tabel: `teams`

Menyimpan data tim yang berpartisipasi dalam lomba.

| Kolom | Tipe | Constraint | Default | Keterangan |
|---|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | | ID unik tim |
| `name` | TEXT | UNIQUE | | Nama tim |
| `score` | INTEGER | | `0` | Skor tim |

**DDL:**
```sql
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  score INTEGER DEFAULT 0
);
```

---

## Tabel: `history`

Menyimpan riwayat perubahan skor dan tindakan selama lomba berlangsung.

| Kolom | Tipe | Constraint | Default | Keterangan |
|---|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | | ID unik record |
| `action` | TEXT | | | Jenis aksi: `'add'`, `'minus'`, `'add-team'`, `'delete-team'` |
| `team_id` | INTEGER | | | ID tim terkait |
| `team_name` | TEXT | | | Nama tim (denormalized untuk history) |
| `value` | INTEGER | | | Nilai perubahan skor |
| `created_at` | DATETIME | | `CURRENT_TIMESTAMP` | Waktu record dibuat |

**DDL:**
```sql
CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT,
  team_id INTEGER,
  team_name TEXT,
  value INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Tabel: `settings`

Menyimpan pengaturan kustomisasi tampilan secara persistent. Sudah aktif di database.

| Kolom | Tipe | Constraint | Keterangan |
|---|---|---|---|
| `key` | TEXT | PRIMARY KEY | Nama pengaturan (e.g. `'header_text'`, `'bg_color'`, `'font_header'`) |
| `value` | TEXT | | Nilai pengaturan (teks, data URL base64, JSON array, dll) |

**DDL:**
```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

---

## Relasi

```
teams (1) ──── (N) history
```

- Satu tim bisa memiliki banyak record history
- History menyimpan `team_id` dan `team_name` (denormalized agar tetap muncul meski tim dihapus)

## Catatan

- Tidak ada foreign key constraint yang didefinisikan di level SQLite
- Database diinisialisasi otomatis saat `database.js` di-load pertama kali
- File `score.db` tidak di-version control (ada di `.gitignore`)
- Backup disimpan sebagai file JSON di folder `backups/`
- Data user saat production (.exe) di `AppData/Roaming/cerdas-cermat-scoreboard/`

## Daftar Key Settings

| Key | Value Type | Default | Keterangan |
|---|---|---|---|
| `header_text` | string | `'LOMBA CERDAS CERMAT'` | Teks header Display |
| `bg_color` | string (hex) | `'#0f172a'` | Warna background Display |
| `bg_image` | string (data URL) | `''` | Gambar background (base64 data URL) |
| `bg_logo` | string (data URL) | `''` | Logo watermark background |
| `bg_logo_opacity` | string (number) | `'10'` | Opacity logo background (0-100) |
| `sponsor_logos` | string (JSON) | `'[]'` | Array `[{name, dataUrl, category}]` untuk sponsor |
| `text_color_header` | string (hex) | `'#ffffff'` | Warna teks header |
| `text_color_team` | string (hex) | `'#ffffff'` | Warna teks nama tim |
| `text_color_score` | string (hex) | `'#ffffff'` | Warna teks skor |
| `text_color_timer` | string (hex) | `'#ffffff'` | Warna teks timer |
| `text_color_footer` | string (hex) | `'#ffffff'` | Warna teks footer |
| `font_header` | string (data URL) | `''` | Font .ttf untuk header (base64 data URL) |
| `font_team` | string (data URL) | `''` | Font .ttf untuk nama tim |
| `font_score` | string (data URL) | `''` | Font .ttf untuk skor |
| `font_timer` | string (data URL) | `''` | Font .ttf untuk timer |
| `font_footer` | string (data URL) | `''` | Font .ttf untuk footer |
| `font_size_header` | string (number) | `'36'` | Ukuran font header (px) |
| `font_size_team` | string (number) | `'24'` | Ukuran font nama tim (px) |
| `font_size_score` | string (number) | `'60'` | Ukuran font skor (px) |
| `font_size_timer` | string (number) | `'48'` | Ukuran font timer (px) |
| `font_size_footer` | string (number) | `'14'` | Ukuran font footer (px) |
| `font_weight_header` | string | `'bold'` | Ketebalan font header (`bold`/`normal`) |
| `font_weight_team` | string | `'bold'` | Ketebalan font nama tim |
| `font_weight_score` | string | `'bold'` | Ketebalan font skor |
| `font_weight_timer` | string | `'bold'` | Ketebalan font timer |
| `font_weight_footer` | string | `'normal'` | Ketebalan font footer |
| `pos_header_x` | string (number) | `'0'` | Offset X header (px) |
| `pos_header_y` | string (number) | `'0'` | Offset Y header (px) |
| `pos_team_x` | string (number) | `'0'` | Offset X nama tim (px) |
| `pos_team_y` | string (number) | `'0'` | Offset Y nama tim (px) |
| `pos_score_x` | string (number) | `'0'` | Offset X skor (px) |
| `pos_score_y` | string (number) | `'0'` | Offset Y skor (px) |
| `pos_timer_x` | string (number) | `'0'` | Offset X timer (px) |
| `pos_timer_y` | string (number) | `'0'` | Offset Y timer (px) |
| `pos_footer_x` | string (number) | `'0'` | Offset X footer (px) |
| `pos_footer_y` | string (number) | `'0'` | Offset Y footer (px) |
| `team_gap` | string (number) | `'80'` | Jarak antar tim (px) |
| `hide_sponsor` | string | `'false'` | Sembunyikan sponsor (`true`/`false`) |
