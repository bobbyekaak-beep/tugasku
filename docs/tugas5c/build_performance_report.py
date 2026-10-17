"""Membuat AP1_P5_KelompokJosjis_Performance_Report.pdf dari hasil_ukur.json."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, ".."))
from pdf_helper import *

DATA = os.path.join(HERE, "hasil_ukur.json")
OUT = os.path.join(HERE, "AP1_P5_KelompokJosjis_Performance_Report.pdf")

# nama, kunci, satuan, arah (True = makin besar makin baik, False = makin kecil makin baik, None = netral)
METRICS = [
    ("Ukuran JavaScript utama", "js_awal_kb", "KB", False),
    ("Ukuran JavaScript utama (gzip)", "js_gzip_kb", "KB", False),
    ("Ukuran CSS", "css_kb", "KB", False),
    ("Jumlah berkas JavaScript", "jumlah_berkas_js", "berkas", None),
    ("Skor Performance Lighthouse", "lighthouse_performance", "dari 100", True),
    ("First Contentful Paint (FCP)", "fcp_detik", "detik", False),
    ("Largest Contentful Paint (LCP)", "lcp_detik", "detik", False),
    ("Total Blocking Time (TBT)", "tbt_ms", "ms", False),
    ("Cumulative Layout Shift (CLS)", "cls", "", False),
]

d = json.load(open(DATA, encoding="utf-8"))
missing = [k for k in ("tanggal_ukur", "cara_membuka_aplikasi", "commit_sebelum", "commit_sesudah", "catatan_hasil") if not d.get(k)]
for grp in ("sebelum", "sesudah"):
    missing += [f"{grp}.{k}" for _, k, _, _ in METRICS if d[grp].get(k) is None]
if missing:
    sys.exit("Isi dulu hasil_ukur.json. Yang masih kosong: " + ", ".join(missing))


def fmt(v):
    return str(int(v)) if float(v).is_integer() else f"{v:g}"


def change(b, a, better_high):
    diff = a - b
    if abs(diff) < 1e-9:
        return "tetap", "sama"
    sign = "+" if diff > 0 else "-"
    txt = f"{sign}{fmt(abs(round(diff, 2)))}"
    if better_high is None:
        return txt, "bertambah" if diff > 0 else "berkurang"
    good = (diff > 0) == better_high
    return txt, "membaik" if good else "memburuk"


rows = [["Metrik", "Sebelum", "Sesudah", "Perubahan", "Keterangan"]]
summary = {"membaik": [], "memburuk": [], "sama": []}
for name, key, unit, hi in METRICS:
    b, a = d["sebelum"][key], d["sesudah"][key]
    txt, word = change(b, a, hi)
    u = f" {unit}" if unit else ""
    rows.append([name, fmt(b) + u, fmt(a) + u, txt, word])
    if word in summary:
        summary[word].append(name)

s = header("Tugas 5c - Laporan Performa Awal", "AP1 Pertemuan 5")

s += [P("1. Tujuan dan Cara Pengukuran", H),
      P("Laporan ini membandingkan kecepatan muat TugasKu sebelum dan sesudah dua langkah optimasi awal. "
        "Semua angka berasal dari pengukuran kelompok kami sendiri pada hasil build, bukan pada server pengembangan."),
      Spacer(1, 4),
      table([["Hal", "Keterangan"],
             ["Tanggal ukur", str(d["tanggal_ukur"])],
             ["Cara membuka aplikasi", str(d["cara_membuka_aplikasi"])],
             ["Perangkat dan mode", str(d["perangkat_dan_mode"])],
             ["Commit sebelum", str(d["commit_sebelum"])],
             ["Commit sesudah", str(d["commit_sesudah"])],
             ["Ukuran bundle", "Dari keluaran perintah npm run build."],
             ["Metrik Lighthouse", "Diukur 3 kali di jendela Incognito, lalu diambil nilai tengah (median)."]],
            [4.5 * cm, 11.5 * cm])]

s += [P("2. Tabel Sebelum dan Sesudah", H), table(rows, [5.0 * cm, 2.5 * cm, 2.5 * cm, 2.8 * cm, 3.2 * cm]),
      Spacer(1, 4),
      P("Catatan: pada code-splitting, jumlah berkas JavaScript biasanya bertambah karena kode dipecah menjadi beberapa "
        "berkas. Itu bukan kemunduran. Yang dilihat adalah ukuran berkas yang dimuat pertama kali.")]

s += [P("3. Langkah Optimasi yang Diterapkan", H),
      table([["No", "Langkah", "Penjelasan", "Berkas"],
             ["1", "Memecah kode per rute (code-splitting)",
              "Layar Tambah atau Ubah Tugas dan Halaman tidak ditemukan dimuat hanya saat dibuka, memakai React.lazy dan "
              "Suspense. Beranda tetap dimuat langsung karena itu layar pertama. Selama layar dimuat, tampil tulisan Memuat.",
              "src/App.tsx"],
             ["2", "Font hanya subset Latin",
              "Font Inter sebelumnya mengimpor semua aksara (Latin, Cyrillic, Yunani, dan lainnya). TugasKu hanya memakai huruf "
              "Latin, jadi impor diganti dengan versi latin untuk ketebalan 400, 600, dan 700 yang sudah dipakai.",
              "src/main.tsx"],
             ["3", "Tes disesuaikan", "Tes yang membuka layar form dan halaman tidak ditemukan kini menunggu layar selesai dimuat.", "src/App.test.tsx"]],
            [1 * cm, 4 * cm, 8.5 * cm, 2.5 * cm]),
      Spacer(1, 4),
      P("Langkah gambar tidak diterapkan karena TugasKu belum memakai gambar selain ikon aplikasi. "
        "Langkah dependensi tidak diterapkan karena aplikasi hanya memakai React, React Router, dan font Inter.")]

parts = []
if summary["membaik"]:
    parts.append("Yang membaik: " + ", ".join(summary["membaik"]) + ".")
if summary["memburuk"]:
    parts.append("Yang memburuk: " + ", ".join(summary["memburuk"]) + ".")
if summary["sama"]:
    parts.append("Yang tidak berubah: " + ", ".join(summary["sama"]) + ".")
s += [P("4. Hasil dan Analisis", H), P(" ".join(parts)), Spacer(1, 4), P(str(d["catatan_hasil"]))]

s += [P("5. Risiko yang Masih Tersisa", H),
      table([["Risiko", "Penjelasan"],
             ["Bundle awal masih memuat React dan React Router", "Keduanya dibutuhkan Beranda, jadi tidak bisa dipecah tanpa mengubah rancangan."],
             ["Ada jeda singkat saat layar form pertama kali dibuka", "Layar dimuat saat dibutuhkan, jadi pada jaringan lambat tulisan Memuat tampil sebentar."],
             ["Angka Lighthouse berubah-ubah antar pengukuran", "Kami mengukur 3 kali dan mengambil nilai tengah, tetapi selisih kecil tetap bisa berasal dari variasi alat."],
             ["Aplikasi masih kecil", "Dengan dua layar utama, selisih ukuran memang kecil. Manfaat code-splitting akan lebih terlihat saat layar bertambah."],
             ["Data belum disimpan di server", "Pengukuran ini belum mencakup waktu pengambilan data dari server Node.js yang akan ditambahkan."]],
            [5.5 * cm, 10.5 * cm])]

s.append(KeepTogether([P("Penggunaan AI", H),
      P("Pengukuran, angka, dan kesimpulan dalam laporan ini berasal dari kelompok kami, dan seluruh isi sudah kami periksa bersama. "
        "Kami memakai Claude (Anthropic) hanya sebagai alat bantu untuk menyusun kode optimasi, kerangka laporan, dan merapikan "
        "bahasa sesuai arahan kami.")]))

build(OUT, s, title="Tugas 5c - Laporan Performa Awal")
print("OK", OUT)
