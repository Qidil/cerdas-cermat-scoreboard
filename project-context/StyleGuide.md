# StyleGuide — Panduan Desain & UI/UX

> Didokumentasikan dari codebase yang sudah ada (spec-init).

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
| Feedback Benar overlay | `rgba(0,255,0,0.8)` | Layar penuh saat jawaban benar |
| Feedback Salah overlay | `rgba(255,0,0,0.8)` | Layar penuh saat jawaban salah |

## Tipografi

| Elemen | Ukuran | Weight | Tracking |
|---|---|---|---|
| Header Display | `text-4xl` | `font-bold` | `tracking-widest` |
| Nama Tim | `text-2xl` | normal | — |
| Skor Tim | `text-6xl` | `font-bold` | — |
| Timer | `text-5xl` | `font-bold` | — |
| Footer | `text-sm` | normal | — |
| Control Panel Title | `text-3xl` | `font-bold` | — |

## Komponen UI

### Display Page (`/display`)
```
┌─────────────────────────────────────┐
│         LOMBA CERDAS CERMAT         │  ← header (h1, 12% height)
├─────────────────────────────────────┤
│                                     │
│          [LOGO] (opacity 10%)       │  ← background watermark
│                                     │
│   ┌─────────┐    ┌─────────┐       │
│   │ Team A  │    │ Team B  │        │  ← team cards
│   │   100   │    │   85    │        │
│   └─────────┘    └─────────┘       │
│                                     │
│              30 (timer)             │  ← timer (pulse animation)
│                                     │
├─────────────────────────────────────┤
│  SUPPORTED BY [logo] [logo]         │  ← footer (10% height)
└─────────────────────────────────────┘
```

### Control Page (`/control`)
```
┌─────────────────────────────────────┐
│          CONTROL PANEL              │
├─────────────────────────────────────┤
│ [Nama Tim] [Tambah Tim]             │
├─────────────────────────────────────┤
│ [✔ BENAR] [✖ SALAH]                │
├─────────────────────────────────────┤
│ TIMER                               │
│ [Detik] [Start][Pause][Resume][Reset]│
├─────────────────────────────────────┤
│ [Pilih Tim] [Skor] [+ Tambah][- Kur]│
├─────────────────────────────────────┤
│ • Team A - 100  ❌                  │  ← team list
│ • Team B - 85   ❌                  │
│ [💾 Simpan]                        │
├─────────────────────────────────────┤
│ Load Match                          │
│ • match-xxx.json  [Load]            │
├─────────────────────────────────────┤
│ HISTORY                             │
│ +10 (Team A)                        │
│ -5 (Team B)                         │
└─────────────────────────────────────┘
```

## Animasi

| Nama | Durasi | Elemen | Efek |
|---|---|---|---|
| `score-pop` | 1s | Angka perubahan skor | Muncul dari posisi tim, membesar, memudar ke atas |
| `fade-zoom` | 0.6s | (tidak digunakan di kode saat ini) | Scale dari 0.5 ke 1 |
| `timer-pulse` | infinite | Timer (saat aktif) | Scale 1 → 1.1 → 1 (berulang) |
| `flicker` | 0.3s (3x) | Feedback overlay | Opacity 1 → 0 → 1 (3 kali) |

## Suara

| File | Dipicu Saat |
|---|---|
| `correct.mp3` | Feedback `'correct'` |
| `wrong.mp3` | Feedback `'wrong'` |
| `tick.mp3` | Setiap detik timer berjalan |

## Layout

- **Display:** `h-screen w-screen` dengan flex column — header (12%), body (78%), footer (10%)
- **Control:** Padding `p-6` dengan layout vertikal (stacked)
- **Responsive:** Belum ada breakpoint khusus; Tailwind utility classes digunakan langsung

> ⚠️ **Perlu verifikasi:** Apakah ada design system atau component library yang direncanakan?
Font family default adalah system font, bisa dikustomisasi per elemen (header, nama tim, skor, timer, footer) melalui upload .ttf di Control Panel.
