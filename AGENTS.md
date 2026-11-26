<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.opencode/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.opencode/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.opencode/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.opencode/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.opencode/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.opencode/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

# Aturan Proyek — Cerdas Cermat Scoreboard

> **Berlaku untuk semua agent AI di repo ini. WAJIB diikuti, DILARANG dilanggar.**
>
> **Prioritas saat konflik:** instruksi eksplisit user di percakapan saat ini → file ini → `project-context/` → default skill/plugin/MCP. Jika aturan ini berbeda dengan `project-context/rules.md`, `fixMode`, atau perilaku default skill, file ini yang menang; laporkan konfliknya ke user sebelum melanjutkan. Khusus `rules.md`: P-002 dan P-004 digantikan oleh aturan 2 dan 9 di file ini.

## 1. Git — DILARANG commit/push tanpa konfirmasi

- DILARANG menjalankan `git commit`, `git push`, `git tag`, `gh pr create`, release, deploy, atau operasi tulis remote lainnya tanpa konfirmasi eksplisit user.
- Operasi yang mengubah history/branch juga butuh konfirmasi: `branch -d/-D`, `merge`, `rebase`, `reset --hard`, `--amend`, force-push.
- Sebelum meminta konfirmasi, tampilkan: file yang berubah, ringkasan diff, hasil validasi/gate, dan risiko.
- Tunggu jawaban eksplisit ("ya", "setuju", "commit", "push"). Diam bukan persetujuan.
- `git status`, `git diff`, `git log`, dan `git add` boleh; tetap laporkan perubahan tak terduga.
- DILARANG commit file berisi secret/token/kredensial.

## 2. Setiap phase selesai — Full Gate, laporan dulu, fix setelah konfirmasi

**Full Gate** = semua pemeriksaan berikut dijalankan sampai selesai (bukan berhenti di temuan pertama), dengan urutan wajib:

1. **spec-compliance** — semua SC-01…SC-08, bukti konkret, alasan `N/A`, `NOT VERIFIED` jika bukti kurang.
2. **code-review** — 27 CR + 10 SEC, severity `BLOCKER` / `MAJOR` / `MINOR` / `INFO`.
3. **impeccable** — `context` sekali per sesi, lalu `audit`/`critique` untuk perubahan UI; verifikasi hasil render di ukuran target.
4. **antislop** — core + sub-skill relevan (`ui`, `copywriting`, `human`, `layoutmobile`, `code`); cek visual boleh memakai Playwright MCP.
5. **ponytail review** — perubahan terkecil yang lengkap, tanpa over-engineering, tanpa abstraksi/dependency tak perlu.

- Jalankan validasi teknis yang relevan (test/lint/build) dan simpan buktinya.
- Jika phase tidak menyentuh UI, `impeccable` dan cek visual antislop boleh `N/A` dengan alasan; aturan komentar kode antislop tetap berlaku.
- Mode antislop mengikuti blok antislop di atas. Jika mode belum jelas, tanyakan dulu; jangan menganggap mode.
- Setelah semua gate selesai: gabungkan temuan (ID, severity, bukti, usulan fix), laporkan ke user, lalu **minta konfirmasi sebelum memperbaiki**.
- DILARANG auto-fix temuan gate. Aturan ini mengalahkan `fixMode: fix-then-report` dan `rules.md` P-002.
- Setelah fix disetujui: jalankan ulang gate yang terdampak; laporkan `resolved` / `partial` / `unresolved` + bukti.
- Phase belum selesai sampai gate yang berlaku lulus (atau user memberi waiver eksplisit) dan `Task.md` + plan phase diperbarui.
- Jika gate tidak bisa dijalankan, tulis `NOT VERIFIED` + alasannya. DILARANG mengklaim PASS tanpa bukti.
- DILARANG memulai phase berikutnya tanpa konfirmasi user.

## 3. Playwright MCP untuk cek tampilan / anti-slop

- Playwright MCP **boleh** dipakai saat perlu memverifikasi tampilan sudah bebas "AI slop", responsive, atau regresi visual.
- Gunakan hanya untuk verifikasi/testing, bukan browsing umum.
- Playwright MCP sudah diarahkan ke Opera GX. DILARANG menjalankan `npx playwright install` / `playwright install` atau mengunduh browser.
- Ambil screenshot pada ukuran nyata (desktop dan ukuran window aplikasi), lalu bandingkan dengan `project-context/StyleGuide.md`.
- Tutup tab/sesi browser setelah selesai; jangan tinggalkan proses berjalan.

## 4. TODO / progress WAJIB terlihat

- TODO list proyek = `project-context/Task.md` + plan phase aktif.
- Setiap selesai task: update `Task.md` (`[ ]` → `[x]`, `[~]` + alasan jika terblokir) dan tabel Progress Overview.
- Setiap selesai task/phase: update checklist di plan phase aktif.
- Laporkan posisi sekarang: phase, task, selesai/tersisa, langkah berikutnya.
- DILARANG menandai selesai tanpa bukti (test/gate/validasi).
- Satu task pada satu waktu; berhenti dan tunggu konfirmasi user sebelum task berikutnya (sesuai Aturan Eksekusi `Task.md`).

## 5. rtk plugin WAJIB untuk command yang didukung

- Plugin `rtk` terpasang global dan otomatis menulis ulang command shell yang didukung lewat hook. Jangan menonaktifkan, bypass, atau menghapus hook-nya.
- Untuk command yang didukung (git, gh, npm, npx, rg/grep, ls/tree/find, diff, test, lint, tsc, playwright, curl, dll.), gunakan bentuk yang dikenali rtk; biarkan hook melakukan rewrite.
- Jika rtk tidak tersedia atau command tidak didukung, jalankan command biasa dan sebutkan alasannya.
- Jangan mengubah output rtk secara manual untuk menyembunyikan error.

## 6. Batas waktu command / console

- Setiap command shell, CMD, console, dev server, atau proses interaktif WAJIB punya batas waktu eksplisit. Default: **120 detik**.
- Boleh menambah waktu hanya jika tugas memang butuh (install/build/test), sebutkan alasannya, dan tetap dibatasi.
- Proses panjang: jalankan di background dengan cara stop yang jelas; DILARANG meninggalkan console yang tidak bisa user matikan.
- Saat timeout: hentikan proses, laporkan, jangan retry diam-diam.

## 7. Plan phase WAJIB dibuat sebelum mulai

- Sebelum memulai phase apa pun, buat `project-context/plans/phase-<N>-<slug>.md` (contoh: `phase-9-export-pdf.md`).
- Isi minimal: `status` (`review` → `in-progress` → `code-review` → `done`), Goal, Scope/Non-goals, Files, Risks, Validation, task + acceptance criteria, checklist progress, dan hasil gate/temuan.
- Review plan terhadap `Task.md` dan spec; tunggu konfirmasi user sebelum `status: in-progress`.
- Update plan selama pengerjaan; jaga `Task.md` tetap sinkron.
- Satu phase pada satu waktu; DILARANG membuka phase berikutnya sebelum phase aktif ditutup.

## 8. Skill `meet` — DILARANG menutup meeting tanpa konfirmasi

- Saat user meminta `meet`, jalankan satu ronde diskusi sesuai agenda.
- DILARANG menutup, mengakhiri, atau menyatakan meeting selesai tanpa konfirmasi eksplisit user. Aturan ini mengalahkan perilaku default skill `meet` yang menutup otomatis.
- DILARANG membuka ronde baru otomatis. Tunggu agenda/instruksi lanjutan.
- Pisahkan rekomendasi dari keputusan yang sudah disetujui user; kesepakatan persona bukan persetujuan user.
- Setelah kontribusi selesai, tahan meeting tetap terbuka dan tanyakan keputusan/agenda berikutnya.

## 9. DILARANG menambah apa pun tanpa konfirmasi

- DILARANG menambah fitur, file, dependency, refactor, perubahan config, rename, format-only churn, komentar massal, abstraksi, atau "nice to have" yang tidak diminta tanpa konfirmasi eksplisit user.
- Saran boleh: tulis terpisah beserta dampak/effort, lalu tunggu keputusan user.
- Perubahan yang diizinkan hanya yang benar-benar dibutuhkan task yang disetujui, termasuk caller/test/fixture yang rusak akibat perubahan tersebut.
- Jika menemukan bug/risiko di luar scope: laporkan, jangan perbaiki diam-diam.

## 10. ponytail WAJIB aktif

- ponytail aktif level **full** selama sesi; jangan mengubah level tanpa permintaan user.
- Perubahan terkecil yang lengkap; hapus lebih baik daripada menambah; pakai helper/komponen/pola yang sudah ada.
- Utamakan stdlib/platform/dependency yang sudah terpasang; DILARANG menambah dependency untuk beberapa baris kode.
- DILARANG abstraksi, wrapper, opsi, config, atau kode "untuk nanti" yang tidak diminta.
- Bug fix: cari root cause sekali di kode bersama, lalu perbaiki semua caller.
- Logika non-trivial baru wajib punya satu test/self-check kecil; perubahan trivial tidak perlu.
- Tandai shortcut yang diketahui dengan komentar: `shortcut: <batas>, <kapan upgrade>`.
- Jalankan ponytail review sebagai bagian dari Full Gate.
- DILARANG memangkas validasi trust boundary, error handling yang mencegah data loss, security, accessibility, atau perilaku yang diminta user.

---

## Aturan Skill & MCP (mengikat)

### Routing skill

| Situasi | Skill | Aturan kunci |
|---|---|---|
| Implementasi phase / perubahan kode | `developer` | Baca `rules.md` + `architecture.md`; satu phase; Full Gate saat penutupan |
| Perubahan kecil terbatas | `quick-dev` | Gate task-scoped; catat di `Task.md` |
| Bug / error / regresi | `bug-fix` | Jelaskan root cause + minta approval sebelum perubahan kode pertama; catat bug setelah user konfirmasi fix |
| Scope/fitur baru | `add-feature` | Hanya jika user eksplisit memperluas scope; update spec; delegate `Task.md` |
| Dokumen spec | `brainstorm-prd` / `-architecture` / `-api` / `-schema` / `-rules` / `-styleguide` / `-task` | Ikuti owner dokumen; jangan menulis spec milik skill lain |
| Konsistensi spec | `spec-audit` | Koreksi hanya setelah diminta |
| Bootstrap spec | `spec-init` | Batch/guided; catat confidence + Missing Decisions |
| Audit rilis | `release-readiness` | Report-only; DILARANG deploy |
| Meeting | `meet` | Aturan 8 |
| Bantuan / config | `help` / `setup-macca-method` | Jangan ubah config tanpa konfirmasi |

- DILARANG melewati gate report-first / approval. Jangan pernah self-approve.
- Jangan biarkan router (`quick-dev`) menangkap balasan untuk gate aktif.
- `bug-fix` dan `add-feature` tidak boleh mulai dari asumsi; ikuti urutan skill.
- Jika skill dan `AGENTS.md` konflik, `AGENTS.md` menang; laporkan.

### MCP

- **codebase-memory-mcp** — WAJIB jadi langkah pertama untuk mencari kode/struktur: `search_graph` → `trace_path` → `get_code_snippet`; `check_index_coverage` untuk path kandidat; `query_graph` untuk multi-hop; `get_architecture` untuk gambaran besar. Fallback ke grep/glob hanya untuk literal, config, file non-kode, atau saat hasil graph tidak cukup. DILARANG mengklaim "tidak ada" tanpa cek coverage.
- **playwright** — hanya untuk verifikasi visual/testing (aturan 3). Jangan install browser.
- **gitmcp / gh_grep** — untuk dokumentasi repo eksternal dan contoh kode nyata saat API/library tidak familiar; jangan coding dari ingatan jika bukti bisa diambil.
- **n8n / rea** — saat ini disabled; jangan dipakai.
- Jangan memakai MCP yang tidak tersedia/disabled; jangan install tool tanpa konfirmasi.

### Larangan teknis (dari `project-context/rules.md`)

Ikuti `rules.md § [FORBIDDEN]`, termasuk:

- DILARANG `nodeIntegration: true` (F-001).
- DILARANG mengirim data sensitif via IPC (F-002).
- DILARANG `var`; wajib `const`/`let` (F-003).
- DILARANG mencampur quote style dalam satu file (F-004).
- DILARANG `alert()` di production (F-005).
- DILARANG `setInterval()` tanpa `clearInterval()` (F-006).
- DILARANG backup di folder yang tidak di-gitignore (F-007).
- DILARANG membuat `Audio` baru setiap render React (F-008).

### Definisi selesai

Task/phase hanya boleh dinyatakan selesai jika:

- acceptance criteria terpenuhi dan dibuktikan;
- validasi teknis (test/lint/build) dijalankan dan hasilnya dilaporkan;
- Full Gate dijalankan untuk phase (atau gate task-scoped untuk `quick-dev`/`bug-fix`);
- temuan sudah dilaporkan dan fix disetujui/diterapkan/diverifikasi;
- `Task.md` dan plan phase diperbarui;
- user diberi ringkasan: perubahan, bukti, risiko, langkah berikutnya.

## Checklist cepat sebelum menjawab "selesai"

- [ ] `Task.md` + plan phase diperbarui
- [ ] Validasi dijalankan dan buktinya ada
- [ ] Full Gate dijalankan (phase) / gate task-scoped (task)
- [ ] Temuan dilaporkan; fix hanya setelah konfirmasi
- [ ] Tidak ada perubahan di luar scope
- [ ] Tidak ada commit/push tanpa konfirmasi
