"""Membuat AP1_P5_KelompokJosjis_PWA_Checklist.pdf
Letakkan 4 tangkapan layar di folder screenshots/ dengan nama:
  1_manifest.png  2_service_worker.png  3_offline.png  4_install.png
Isi URL_DEPLOY, lalu jalankan:  python3 build_checklist.py
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, Image, KeepTogether)

URL_DEPLOY = "https://(isi dengan URL Vercel atau Netlify kelompok)"
OUT = "AP1_P5_KelompokJosjis_PWA_Checklist.pdf"

def st(name, **kw):
    base = dict(fontName="Times-Roman", fontSize=12, leading=16,
                textColor=colors.black, alignment=TA_JUSTIFY)
    base.update(kw); return ParagraphStyle(name, **base)
BODY = st("body"); LEFT = st("left", alignment=TA_LEFT)
TITLE = st("title", fontName="Times-Bold", alignment=TA_CENTER, spaceAfter=2)
SUB = st("sub", alignment=TA_CENTER)
H = st("h", fontName="Times-Bold", alignment=TA_LEFT, spaceBefore=12, spaceAfter=4)
CELL = st("cell", alignment=TA_LEFT, leading=15)
CAP = st("cap", alignment=TA_CENTER)
P = lambda t, s=BODY: Paragraph(t, s)

def table(rows, widths):
    t = Table([[P(c, CELL) for c in r] for r in rows], colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([("GRID",(0,0),(-1,-1),0.6,colors.black),
                           ("VALIGN",(0,0),(-1,-1),"TOP"),
                           ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
    return t

def shot(name, caption):
    path = os.path.join("screenshots", name)
    if os.path.exists(path):
        from PIL import Image as PI
        w, h = PI.open(path).size
        r = min(14*cm/w, 8*cm/h)
        el = Image(path, width=w*r, height=h*r)
    else:
        el = Table([[P("Tempel tangkapan layar di sini", CAP)]], colWidths=[14*cm], rowHeights=[5.5*cm])
        el.setStyle(TableStyle([("BOX",(0,0),(-1,-1),0.6,colors.black),("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
    return KeepTogether([el, Spacer(1,4), P(caption, CAP), Spacer(1,10)])

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=2.5*cm, rightMargin=2.5*cm,
                        topMargin=2.5*cm, bottomMargin=2.5*cm,
                        title="Tugas 5a - PWA Minimal Viable", author="Kelompok Josjis")
s = []
s += [P("Tugas 5a - PWA Minimal Viable", TITLE),
      P("TugasKu: Aplikasi Manajemen Tugas Kuliah", SUB),
      P("AP1 Pertemuan 5 - Kelompok Josjis", SUB), Spacer(1,10),
      P("Bobby Eka Angga Kusuma (251111021, ketua)", LEFT),
      P("Tyo Dzaky Kamaludin (251111009)", LEFT),
      P("Geraldy Fauzy Setiabudi (251111010)", LEFT)]

s += [P("1. Tujuan dan Hasil", H),
      P("Tugas ini membuat TugasKu bisa dipasang di layar utama seperti aplikasi biasa. "
        "Saat internet putus, TugasKu tidak menampilkan layar kosong, tetapi halaman berisi pesan "
        "\"Anda sedang offline\". Untuk itu kami menambahkan tiga hal ke repositori Pertemuan 4, "
        "yaitu manifest, service worker, dan halaman offline. Aplikasi juga harus dibuka lewat HTTPS "
        "agar bisa dipasang di ponsel."),
      Spacer(1,4),
      P("URL publik (HTTPS): " + URL_DEPLOY, LEFT),
      P("Repositori: https://github.com/bobbyekaak-beep/tugasku", LEFT)]

s += [P("2. Berkas yang Ditambahkan", H),
      table([["Berkas","Letak di repositori","Fungsi"],
        ["manifest.json","public/","Memberi nama, ikon, dan warna aplikasi agar bisa dipasang."],
        ["sw.js","public/","Menyimpan berkas penting ke cache dan menjawab permintaan saat offline."],
        ["offline.html","public/","Halaman yang tampil ketika internet putus."],
        ["icon-192.png, icon-512.png, icon-512-maskable.png","public/icons/","Ikon aplikasi. Versi maskable tidak terpotong di Android."],
        ["vercel.json","akar repositori","Mengarahkan semua alamat ke index.html agar rute seperti /tambah tidak 404 setelah deploy."],
        ["index.html dan src/main.tsx","sudah ada, diubah","Menautkan manifest dan mendaftarkan service worker."]],
        [4.8*cm, 3.4*cm, 7.8*cm])]

s += [P("3. Cara Kerja Singkat", H),
      P("Service worker bekerja dalam tiga tahap. Pertama, saat dipasang, ia menyimpan empat berkas penting ke cache. "
        "Kedua, saat aktif, ia menghapus cache versi lama. Ketiga, setiap ada permintaan, ia memilih jawabannya. "
        "Untuk halaman, ia mencoba internet lebih dulu. Jika gagal, ia menampilkan offline.html. "
        "Untuk berkas lain seperti gambar dan gaya tampilan, ia memakai cache bila ada."),
      Spacer(1,4),
      P("Warna tema aplikasi adalah biru utama TugasKu (#2563EB), sama dengan warna pada style guide Pertemuan 3. "
        "Nama cache memakai nomor versi (tugasku-static-v1) supaya pengguna tidak terus melihat versi lama.")]

s += [P("4. Cara Pengujian", H),
      P("Pengujian dilakukan pada hasil build, bukan server pengembangan, karena service worker baru diuji dengan benar pada build."),
      Spacer(1,4),
      P("1. Jalankan \"npm run build\", lalu \"npm run preview\".", LEFT),
      P("2. Buka Chrome DevTools, tab Application, bagian Manifest. Pastikan tidak ada galat.", LEFT),
      P("3. Buka bagian Service Workers. Pastikan statusnya \"activated and is running\".", LEFT),
      P("4. Centang Offline, muat ulang halaman, lalu buka satu rute lain. Pastikan halaman offline tampil.", LEFT),
      P("5. Pastikan ikon pasang muncul di bilah alamat, atau menu Tambahkan ke layar utama di Android.", LEFT)]

s += [P("5. Daftar Pemeriksaan", H),
      table([["No","Pemeriksaan","Hasil yang diharapkan","Bukti"],
        ["1","Manifest terbaca","Tidak ada galat. Nama, ikon, dan warna tampil.","Gambar 1"],
        ["2","Service worker aktif","Status \"activated and is running\".","Gambar 2"],
        ["3","Halaman offline","Halaman \"Anda sedang offline\" tampil, bukan dinosaurus Chrome.","Gambar 3"],
        ["4","Bisa dipasang","Ikon pasang atau menu Tambahkan ke layar utama muncul.","Gambar 4"]],
        [1.1*cm, 4*cm, 8.4*cm, 2.5*cm])]

s += [P("6. Bukti", H),
      shot("1_manifest.png","Gambar 1. Tab Application, bagian Manifest tanpa galat"),
      shot("2_service_worker.png","Gambar 2. Service worker berstatus activated and is running"),
      shot("3_offline.png","Gambar 3. Halaman offline tampil saat mode Offline dicentang"),
      shot("4_install.png","Gambar 4. Ikon pasang atau menu Tambahkan ke layar utama")]

s += [P("7. Kendala dan Catatan", H),
      table([["Hal yang perlu dijaga","Cara penanganan"],
        ["Satu berkas di daftar cache yang tidak ada (404) membuat service worker gagal terpasang.","Daftar cache hanya berisi berkas yang ada di folder public/."],
        ["Pengguna bisa terus melihat versi lama setelah aplikasi diubah.","Nomor versi cache dinaikkan (v1 menjadi v2) setiap sw.js berubah."],
        ["Service worker hanya berjalan di HTTPS (localhost dikecualikan).","Aplikasi di-deploy ke Vercel agar mendapat HTTPS gratis dan bisa dipasang di ponsel."],
        ["Rute selain beranda bisa 404 setelah deploy.","vercel.json mengarahkan semua alamat ke index.html."],
        ["Data tugas masih di memori, sehingga hilang saat halaman dimuat ulang.","Bukan bagian tugas ini. Penyimpanan permanen lewat Node.js dikerjakan setelah skeleton, sesuai proposal final."]],
        [8*cm, 8*cm])]

s += [P("Penggunaan AI", H),
      P("Rancangan, pilihan konfigurasi, dan hasil pengujian berasal dari kelompok kami, dan seluruh isi sudah kami periksa bersama. "
        "Kami memakai Claude (Anthropic) hanya sebagai alat bantu untuk menyusun kode awal berkas PWA dan merapikan bahasa laporan ini sesuai arahan kami.")]
doc.build(s)
print("OK")
