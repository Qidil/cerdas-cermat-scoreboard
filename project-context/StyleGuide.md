# StyleGuide — Panduan Desain & UI/UX

> Didokumentasikan dari codebase yang sudah ada (spec-init) — diperbarui 30 Juli 2026.

## Warna

| Role | CSS Class / Value | Penggunaan |
|---|---|---|
| Background utama | `bg-slate-900` (#0f172a) | Display & Control halaman |
| Teks utama | `text-white` (#fff) | Header, skor, timer |
| Tombol Tambah / Benar | `bg-green-500` (#22c55e) | Add team, Add score, Benar, Resume |
| Tombol Kurangi / Salah | `bg-red-500` (#ef4444) | Minus score, Salah |
| Tombol aksi | `bg-blue-500` (#3b82f6) | Tambah Tim, Start, Simpan |
| Tombol Pause | `bg-yellow-500` (#eab308) | Pause timer |
| Tombol Reset | `bg-gray-500` (#6b7280) | Reset timer |
| Feedback Benar overlay | Hijau dengan SVG centang putih 70vh | Layar penuh saat jawaban benar |
| Feedback Salah overlay | Merah dengan SVG huruf X putih 70vh | Layar penuh saat jawaban salah |
| Card Control Panel | `bg-slate-800` (#1e293b) | Background kartu fungsi |
| Border card | `border-slate-700` (#334155) | Border kartu |

## Tipografi

| Elemen | Ukuran Default | Weight Default | Tracking | Kustomisasi |
|---|---|---|---|---|
| Header Display | 36px | bold | `tracking-widest` | font_size_header, font_weight_header, font_header (ttf), offset X/Y |
| Nama Tim | 24px | bold | — | font_size_team, font_weight_team, font_team (ttf), offset X/Y |
| Skor Tim | 60px | bold | — | font_size_score, font_weight_score, font_score (ttf), offset X/Y |
| Timer | 48px | bold | — | font_size_timer, font_weight_timer, font_timer (ttf), offset X/Y |
| Footer | 14px | normal | — | font_size_footer, font_weight_footer, font_footer (ttf), offset X/Y |
| Control Panel Title | `text-3xl` | `font-bold` | — | Tidak bisa dikustomisasi |

Semua ukuran font bisa diatur via input number (min=1, tanpa batas atas). Semua weight bisa toggle bold/normal.

## Komponen UI

### Display Page (`/display`)
```
┌─────────────────────────────────────┐
│         LOMBA CERDAS CERMAT         │  ← header (h1, bisa dikosongkan)
├─────────────────────────────────────┤
│                                     │
│          [LOGO] (opacity adjustable) │  ← background watermark
│                                     │
│   ┌─────────┐    ┌─────────┐       │
│   │ Team A  │    │ Team B  │        │  ← team cards (gap adjustable)
│   │   100   │    │   85    │        │
│   └─────────┘    └─────────┘       │
│                                     │
│              30 (timer)             │  ← timer (pulse animation)
│                                     │
├─────────────────────────────────────┤
│  SUPPORTED BY [logo] [logo]         │  ← footer (bisa di-hide)
└─────────────────────────────────────┘
```

### Control Page (`/control`) — Card-based Layout
```
┌─────────────────────────────────────┐
│          CONTROL PANEL              │
│                                     │
│  ┌── TIM ────────────────────────┐  │
│  │ [Input Nama Tim] [Tambah]     │  │
│  │ • Team A - 100  [Hapus]       │  │
│  │ • Team B - 85   [Hapus]       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌── SKOR ───────────────────────┐  │
│  │ [BENAR] [SALAH]               │  │
│  │ [Pilih Tim] [Nilai] [+][-]    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌── TIMER ──────────────────────┐  │
│  │ [Detik] [Start] [Pause]       │  │
│  │ [Resume] [Reset]              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌── DATA ───────────────────────┐  │
│  │ [💾 Simpan]                   │  │
│  │ • match-xxx.json [Load]       │  │
│  │ HISTORY:                       │  │
│  │ +10 (Team A)                   │  │
│  │ -5 (Team B)                    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌── TAMPILAN (▼ expand) ────────┐  │
│  │ Header text, warna, font,      │  │
│  │ ukuran, posisi, weight,        │  │
│  │ background, logo, sponsor,     │  │
│  │ hide sponsor                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

Card TAMPILAN bersifat collapsible agar tidak memakan ruang saat tidak digunakan.

### Control Page (`/control`) — Tab-based Layout (Fase 5)
```
┌─────────────────────────────────────────┐
│  CONTROL PANEL                          │
│                                         │
│  [Operator] [Soal] [Tampilan] [Histori] │  ← tab menu (atas)
│  ┌───────────────────────────────────┐  │
│  │  Konten tab aktif (hanya satu)    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

| Tab | Isi |
|---|---|
| **Operator** | Card TIM, SKOR, TIMER (seperti layout card-based lama) |
| **Soal** | Upload .json/.csv, daftar soal, klik soal = toggle popup di Display |
| **Tampilan** | Semua pengaturan tampilan Display + pengaturan popup soal |
| **Histori** | History, save/load match, export PNG |

### Popup Soal di Display
```
┌─────────────── layar Display ───────────────┐
│                                              │
│            (background tetap tampil)         │
│   ┌───────────────────────────────┐         │
│   │    Pertanyaan (teks besar)    │  ← popup│
│   │                               │   (w/h  │
│   │   A. opsi   B. opsi          │    dari │
│   │   C. opsi   D. opsi          │    setting)│
│   └───────────────────────────────┘         │
│                                              │
└──────────────────────────────────────────────┘
```

| Setting Popup | Default | Keterangan |
|---|---|---|
| `popup_width` | 900px | Lebar popup |
| `popup_height` | 500px | Tinggi popup |
| `popup_bg_color` | `#1e293b` | Background solid |
| `popup_bg_image` | — | Background gambar (data URL) |
| `popup_font` | — | Font .ttf custom |
| `popup_font_size` | 36px | Ukuran teks soal |
| `popup_text_color` | `#ffffff` | Warna teks soal |
| `popup_option_color` | `#94a3b8` | Warna opsi jawaban |
| `popup_badge_bg_color` | `#ffffff` | Background badge tipe soal (opacity 15%) |
| `popup_badge_opacity` | 15% | Opacity background badge tipe soal |
| `popup_option_bg_color` | `#ffffff` | Background opsi jawaban (opacity 10%) |
| `popup_option_bg_opacity` | 10% | Opacity background opsi jawaban |
| `popup_border_color` | `#ffffff` | Warna border popup |
| `popup_border_width` | 0px | Ketebalan border popup |
| `popup_shadow` | on | Tampilkan/sembunyikan shadow popup |
| `popup_font_badge` | — | Font .ttf badge tipe soal (fallback: `popup_font`) |
| `popup_font_question` | — | Font .ttf teks soal (fallback: `popup_font`) |
| `popup_font_option` | — | Font .ttf teks opsi (fallback: `popup_font`) |
| `popup_badge_font_size` | 14px | Ukuran font badge |
| `popup_badge_bg_padding_x` | 12px | Padding horizontal background badge |
| `popup_badge_bg_padding_y` | 4px | Padding vertikal background badge |
| `popup_badge_pos_x` | 0px | Offset X posisi badge |
| `popup_badge_pos_y` | 0px | Offset Y posisi badge |
| `popup_option_font_size` | 20px | Ukuran font opsi |
| `popup_option_bg_padding_x` | 24px | Padding horizontal background opsi |
| `popup_option_bg_padding_y` | 12px | Padding vertikal background opsi |
| `popup_option_pos_x` | 0px | Offset X posisi opsi |
| `popup_option_pos_y` | 0px | Offset Y posisi opsi |

Popup ditampilkan di tengah layar Display, di atas background yang tetap terlihat.

## Animasi

| Nama | Durasi | Elemen | Efek |
|---|---|---|---|
| `score-pop` | 1s | Angka perubahan skor | Muncul dari posisi tim, membesar, memudar ke atas |
| `fade-zoom` | 0.6s | (tidak digunakan di kode saat ini) | Scale dari 0.5 ke 1 |
| `timer-pulse` | infinite | Timer (saat aktif) | Scale 1 → 1.1 → 1 (berulang) |
| `flicker` | 0.3s (3x) | Feedback overlay | Opacity 1 → 0 → 1 (3 kali) |
| `popup-in` | 0.25s | Popup soal (muncul) | Fade in + scale 0.9 → 1 |
| `popup-out` | 0.2s | Popup soal (tutup) | Fade out + scale 1 → 0.9 |

## Suara

| File | Dipicu Saat |
|---|---|
| `correct.mp3` | Feedback `'correct'` |
| `wrong.mp3` | Feedback `'wrong'` |
| `tick.mp3` | Setiap detik timer berjalan |

## Feedback Visual

- **Benar:** Overlay hijau fullscreen + SVG ikon centang putih (70vh) di tengah
- **Salah:** Overlay merah fullscreen + SVG ikon huruf X putih (70vh) di tengah
- Suara diputar bersamaan dengan overlay (audio di-reset sebelum play untuk cegah tumpang tindih)

## Layout

- **Display:** `h-screen w-screen` dengan flex column — header (12%), body (78%), footer (10%)
- **Control:** Padding `p-6` dengan layout card-based vertikal (TIM, SKOR, TIMER, DATA, TAMPILAN)
- **Responsive:** Belum ada breakpoint khusus; Tailwind utility classes digunakan langsung
- **Font family:** System font default, bisa dikustomisasi per elemen via upload .ttf
