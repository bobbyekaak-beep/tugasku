# TugasKu

Aplikasi web responsif (mobile-first) untuk membantu mahasiswa melihat tugas dari yang paling dekat tenggatnya.

Proyek mata kuliah AP1, Kelompok Josjis:

- Bobby Eka Angga Kusuma (251111021, ketua)
- Tyo Dzaky Kamaludin (251111009)
- Geraldy Fauzy Setiabudi (251111010)

## Fitur

Dashboard web (desktop-first, tetap responsif di HP) yang merealisasikan mockup Beranda TugasKu. Data tersimpan di `localStorage` perangkat (belum ada server).

- Beranda: sapaan, Tugas Mendatang, Ringkasan Tugas (lingkaran persen), Aksi Cepat, Kalender mini, Aktivitas Terbaru.
- Tugas: daftar lengkap dengan filter, pencarian, urutan, tandai selesai, ubah, hapus, dan lampiran file.
- Kalender: kalender bulanan, tugas per tanggal, tambah tugas di tanggal terpilih.
- Profil, Pengaturan (animasi cahaya, pengingat, reset data), Masuk/Keluar, notifikasi lonceng.
- Background ambient biru-ungu yang bergerak pelan dan card glass (transparan + blur). Animasi bisa dimatikan di Pengaturan.
- PWA minimal (bisa dipasang dan punya halaman offline).

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

## Komponen reusable

Tiga komponen ada di `src/components`: `Button`, `Card`, dan `FormField`. Gayanya ada di `src/styles/components.css` dan memakai variabel dari `variables.css` (style guide Pertemuan 3). Dokumentasi lengkap (properti, variasi, state, contoh, dan batasan) ada di `docs/tugas5b/AP1_P5_KelompokJosjis_Component_Library.pdf`.

| Komponen    | Dipakai di                                                          |
| ----------- | ------------------------------------------------------------------- |
| `Button`    | Beranda, Tambah atau Ubah Tugas, Halaman tidak ditemukan            |
| `Card`      | Kartu tugas di Beranda                                              |
| `FormField` | Nama tugas, mata kuliah, tanggal tenggat, dan catatan di form tugas |

```tsx
<Button to="/tambah" fullWidth>Tambah Tugas</Button>
<FormField id="title" label="Nama tugas" requirement="wajib" value={title} onChange={...} error={errors.title} />
```

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
