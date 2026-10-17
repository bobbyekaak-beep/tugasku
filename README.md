# TugasKu

Aplikasi web responsif (mobile-first) untuk membantu mahasiswa melihat tugas dari yang paling dekat tenggatnya.

Proyek mata kuliah AP1, Kelompok Josjis:

- Bobby Eka Angga Kusuma (251111021, ketua)
- Tyo Dzaky Kamaludin (251111009)
- Geraldy Fauzy Setiabudi (251111010)

## Fitur skeleton

Skeleton ini berisi kerangka dua fitur inti MVP dengan data contoh di memori (belum ada server dan penyimpanan permanen). Tampilannya mengikuti `Mockup_P3_Home.pdf`, `Mockup_P3_FiturInti.pdf`, dan `StyleGuide_P3.pdf`.

- Beranda: sapaan, daftar tugas terurut, bagian "Prioritas Mendekati Tenggat", badge sisa hari, dan tombol Tambah Tugas yang tetap di bawah layar saat daftar di-scroll.
- Tambah Tugas: form yang dipakai ulang untuk Ubah Tugas (ketuk kartu di Beranda). Tombol simpan juga tetap di bawah layar saat form di-scroll.
- Navigasi bawah (Beranda, Tugas, Kalender, Profil). Hanya Beranda yang aktif di MVP.
- Halaman not found untuk alamat yang tidak dikenal.
- PWA minimal (Pertemuan 5): aplikasi bisa dipasang di layar utama dan menampilkan halaman offline saat internet putus.
- Di layar lebar (laptop), aplikasi tampil di dalam bingkai iPhone 16 Pro Max seperti mockup. Di HP, bingkai hilang dan aplikasi memenuhi layar.

## Cara menjalankan

Yang dibutuhkan: Node.js 20 atau lebih baru dan Git.

```bash
git clone https://github.com/bobbyekaak-beep/tugasku.git
cd tugasku
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

## Skrip

| Perintah               | Fungsi                                    |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Menjalankan aplikasi untuk pengembangan   |
| `npm run build`        | Mengecek tipe lalu membuat versi produksi |
| `npm run preview`      | Mencoba hasil build secara lokal          |
| `npm run lint`         | Memeriksa kode dengan ESLint              |
| `npm run format`       | Merapikan semua berkas dengan Prettier    |
| `npm run format:check` | Mengecek kerapian tanpa mengubah berkas   |
| `npm test`             | Menjalankan pengujian dengan Vitest       |

## Struktur folder

```text
tugasku/
├── src/
│   ├── components/   Komponen yang dipakai ulang (TaskCard, DeadlineBadge, BottomNav, Icon, DeviceFrame)
│   ├── pages/        Layar: HomePage, TaskFormPage, NotFoundPage
│   ├── context/      TaskContext, tempat daftar tugas disimpan
│   ├── types/        Tipe data Task
│   ├── utils/        Perhitungan sisa hari dan format tanggal (beserta tes)
│   ├── styles/       variables.css (warna, spacing dari style guide) dan global.css
│   ├── App.tsx       Daftar rute
│   └── main.tsx      Titik masuk aplikasi (juga mendaftarkan service worker)
├── public/           Berkas PWA: manifest.json, sw.js, offline.html, icons/
├── docs/tugas5a/     Skrip pembuat laporan PWA dan tangkapan layar bukti
├── vercel.json       Aturan rute untuk deploy di Vercel
├── .editorconfig     Aturan dasar editor
├── .prettierrc       Aturan Prettier
├── eslint.config.js  Aturan ESLint
├── index.html
└── vite.config.ts
```

## Rute

| Alamat      | Layar                               |
| ----------- | ----------------------------------- |
| `/`         | Beranda                             |
| `/tambah`   | Tambah Tugas                        |
| `/ubah/:id` | Ubah Tugas (memakai form yang sama) |
| lainnya     | Halaman tidak ditemukan             |

## PWA

Berkas PWA ada di folder `public/`: `manifest.json` (nama, ikon, warna), `sw.js` (service worker), `offline.html` (halaman saat offline), dan `icons/`. Service worker hanya aktif pada hasil build, jadi ujinya begini:

```bash
npm run build
npm run preview
```

Lalu buka Chrome DevTools, tab Application. Cek Manifest, Service Workers, dan centang Offline untuk melihat halaman fallback. Jika isi `sw.js` atau daftar berkas di dalamnya berubah, naikkan nomor versi cache (`tugasku-static-v1` menjadi `v2`). Untuk deploy di Vercel, `vercel.json` mengarahkan semua alamat ke `index.html` agar rute seperti `/tambah` tidak 404.

## Teknologi

React, TypeScript, Vite, React Router, CSS biasa dengan variabel, font Inter (lewat paket Fontsource), ESLint, Prettier, Vitest, dan React Testing Library. Alasan pemilihannya ada di ADR-001.

## Catatan

- Tanggal pada data contoh dibuat relatif terhadap hari ini, jadi badge di Beranda selalu terlihat seperti rancangan mockup.
- Data akan hilang saat halaman dimuat ulang. Penyimpanan permanen dikerjakan setelah skeleton.

## Penggunaan AI

Rancangan layar, pilihan teknologi, dan struktur proyek berasal dari kelompok kami. Claude (Anthropic) hanya dipakai sebagai alat bantu untuk menyusun kode awal dan merapikan README sesuai arahan kami, dan seluruh isinya sudah kami periksa bersama.
