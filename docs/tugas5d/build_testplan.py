"""Membuat AP1_P5_KelompokJosjis_TestPlan_Basic.pdf (jalankan dari folder mana saja)."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from pdf_helper import *
from reportlab.lib.styles import ParagraphStyle
H_FREE = ParagraphStyle("h_free", parent=H, keepWithNext=0)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "AP1_P5_KelompokJosjis_TestPlan_Basic.pdf")
URL = "https://tugasku-omega.vercel.app"

s = header("Tugas 5d - Rencana Uji Fungsional Dasar", "AP1 Pertemuan 5")

s += [P("1. Tujuan dan Ruang Lingkup", H),
      P("Rencana ini menguji alur utama TugasKu, yaitu mahasiswa mencatat tugas, melihat tugas yang paling "
        "dekat tenggatnya, lalu menandai selesai atau mengubahnya. Ada delapan skenario. Di dalamnya sudah ada "
        "satu skenario kondisi offline (TC-07), satu skenario masukan salah (TC-03), dan satu skenario nilai batas "
        "(TC-04). Hasil yang diharapkan ditulis sebelum pengujian dijalankan, supaya tidak disesuaikan setelah "
        "melihat layar. Rencana ini belum memuat hasil uji.")]

s += [P("2. Persiapan", H),
      P("Alamat uji: " + URL + " (hasil deploy). Cara lain: jalankan <i>npm run build</i> lalu "
        "<i>npm run preview</i> dan buka alamat yang muncul.", LEFT),
      P("Peramban: Google Chrome. Skenario offline memakai DevTools, tab Application.", LEFT),
      P("Data awal: aplikasi membuka lima tugas contoh dengan tenggat relatif terhadap hari ini: Basis Data Lanjut "
        "(1 hari), Finance Technology (3 hari), Bahasa Indonesia (6 hari), Agama (12 hari), dan Front End "
        "(sudah selesai). Data disimpan di memori, jadi kembali ke data awal setiap halaman dimuat ulang.", LEFT),
      P("Setiap skenario dimulai dari data awal. Muat ulang halaman sebelum memulai skenario berikutnya. Kolom Catatan berisi jenis skenario. Skenario offline (TC-07) diuji pada hasil build, bukan server pengembangan.", LEFT)]

W = [1.7 * cm, 2.6 * cm, 4.9 * cm, 4.6 * cm, 2.2 * cm]
rows = [["ID", "Judul", "Langkah", "Hasil yang Diharapkan", "Catatan"],
 ["TC-01", "Beranda mengurutkan tugas dari yang paling dekat",
  "1. Buka TugasKu di Beranda.<br/>2. Lihat bagian Prioritas Mendekati Tenggat.<br/>3. Lihat bagian Daftar Tugas Lainnya.",
  "Bagian Prioritas tampil lebih dulu. Isinya tugas belum selesai dengan sisa 3 hari atau kurang, urut dari yang paling dekat "
  "(Basis Data Lanjut lalu Finance Technology). Tugas lain, termasuk yang selesai, ada di Daftar Tugas Lainnya. "
  "Setiap tugas punya badge berisi teks sisa hari.",
  "Alur utama"],
 ["TC-02", "Menambah tugas dengan data lengkap",
  "1. Ketuk Tambah Tugas di Beranda.<br/>2. Isi Nama tugas: Laporan Praktikum.<br/>3. Pilih mata kuliah Basis Data Lanjut dan jenis Kelompok.<br/>"
  "4. Pilih tanggal tenggat 2 hari dari hari ini.<br/>5. Ketuk Simpan Tugas.",
  "Aplikasi kembali ke Beranda. Tugas Laporan Praktikum muncul di bagian Prioritas dengan badge merah 2 hari dan "
  "keterangan Tugas kelompok.",
  "Alur utama"],
 ["TC-03", "Nama tugas dikosongkan",
  "1. Ketuk Tambah Tugas di Beranda.<br/>2. Biarkan Nama tugas kosong.<br/>3. Ketuk Simpan Tugas.",
  "Aplikasi tetap di layar Tambah Tugas. Muncul pesan Nama tugas wajib diisi dengan ikon peringatan di bawah kolom, "
  "dan kolom bergaris merah. Tidak ada tugas baru di Beranda.",
  "Masukan salah"],
 ["TC-04", "Batas prioritas: 3 hari dan 4 hari",
  "1. Tambah tugas Uji 3 Hari dengan tenggat 3 hari dari hari ini.<br/>2. Tambah tugas Uji 4 Hari dengan tenggat 4 hari dari hari ini.<br/>"
  "3. Lihat Beranda.",
  "Uji 3 Hari ada di bagian Prioritas dengan badge merah 3 hari. Uji 4 Hari ada di Daftar Tugas Lainnya dengan badge kuning 4 hari.",
  "Nilai batas"],
 ["TC-05", "Menandai tugas selesai",
  "1. Di Beranda, ketuk lingkaran di kiri tugas Agama.<br/>2. Ketuk lingkaran itu sekali lagi.",
  "Setelah ketukan pertama, lingkaran berisi centang hijau, judul dicoret, dan badge menjadi Selesai berwarna hijau "
  "dengan ikon centang. Jumlah badge Selesai di Beranda naik dari 1 menjadi 2. Setelah ketukan kedua, tugas kembali belum selesai.",
  "Alur utama"],
 ["TC-06", "Mengubah tugas",
  "1. Ketuk kartu Bahasa Indonesia (bukan lingkarannya).<br/>2. Periksa judul layar dan isian.<br/>"
  "3. Ganti Nama tugas menjadi Bahasa Indonesia Esai.<br/>4. Ketuk Simpan Perubahan.",
  "Judul layar Ubah Tugas dan semua isian terisi data lama. Setelah disimpan, aplikasi kembali ke Beranda, "
  "judul tugas berubah, jumlah tugas tetap, dan tenggat tidak berubah.",
  "Alur utama"],
 ["TC-07", "Membuka aplikasi saat offline",
  "1. Buka alamat uji di Chrome dan tunggu sampai service worker aktif.<br/>2. Buka DevTools, tab Application, lalu centang Offline.<br/>"
  "3. Muat ulang halaman.<br/>4. Hilangkan centang Offline, lalu ketuk Coba Lagi.",
  "Saat offline tampil halaman Anda sedang offline beserta tombol Coba Lagi, bukan layar dinosaurus Chrome. "
  "Setelah koneksi kembali dan Coba Lagi diketuk, Beranda tampil normal.",
  "Kondisi offline"],
 ["TC-08", "Membuka alamat yang tidak ada",
  "1. Buka alamat /tidak-ada di belakang alamat uji.<br/>2. Ketuk Kembali ke Beranda.",
  "Tampil Halaman tidak ditemukan beserta penjelasan singkat. Setelah tombol diketuk, Beranda tampil.",
  "Rute tidak dikenal"],
]
s += [PageBreak(), P("3. Skenario Uji", H_FREE), table(rows, W)]

s += [P("4. Catatan Pelaksanaan", H),
      P("Hasil yang sebenarnya, status lulus atau gagal, dan bukti akan dicatat saat pengujian dijalankan. "
        "Jika hasil berbeda dari kolom Hasil yang Diharapkan, perbedaannya ditulis sebagai laporan bug. "
        "Format laporan bug mengikuti Modul Praktik: Menjadi Penguji (Tester) Aplikasi Nyata.")]

s.append(KeepTogether([P("Penggunaan AI", H),
      P("Pemilihan alur utama dan penentuan hasil yang diharapkan berasal dari kelompok kami, dan seluruh isi sudah kami "
        "periksa bersama. Kami memakai Claude (Anthropic) hanya sebagai alat bantu untuk menyusun kerangka tabel dan "
        "merapikan bahasa dokumen ini sesuai arahan kami.")]))

build(OUT, s, landscape_mode=False, title="Tugas 5d - Rencana Uji Fungsional Dasar")
print("OK", OUT)
