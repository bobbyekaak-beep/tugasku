"""Membuat AP1_P5_KelompokJosjis_Component_Library.pdf (jalankan dari folder mana saja)."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from pdf_helper import *

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "AP1_P5_KelompokJosjis_Component_Library.pdf")
W = 16 * cm
PROP = [2.7 * cm, 3.4 * cm, 2.2 * cm, 2.2 * cm, 5.5 * cm]

s = header("Tugas 5b - Komponen Reusable", "AP1 Pertemuan 5")

s += [P("1. Tujuan dan Ringkasan", H),
      P("Skeleton TugasKu memakai tombol, kartu, dan kolom isian di banyak layar, tetapi dulu masing-masing "
        "ditulis ulang di tiap halaman. Pada tugas ini kami membuat tiga komponen yang bisa dipakai ulang, "
        "yaitu <b>Button</b>, <b>Card</b>, dan <b>FormField</b>. Ketiganya ada di folder <i>src/components</i>, "
        "memakai warna dan jarak dari style guide Pertemuan 3, dan sudah dipasang di layar Beranda, "
        "Tambah atau Ubah Tugas, dan Halaman tidak ditemukan. Repositori: "
        "https://github.com/bobbyekaak-beep/tugasku")]

s += [P("2. Prinsip Rancangan", H),
      table([["Prinsip", "Penerapan di komponen kami"],
             ["Satu komponen, satu tugas", "Button hanya menjadi tombol, Card hanya membungkus isi, FormField hanya "
              "mengurus label, kolom isian, dan pesan. Tidak ada yang mengambil data."],
             ["Properti jelas", "Properti wajib dan opsional dibedakan, dan semua opsional punya nilai bawaan "
              "(lihat tabel tiap komponen)."],
             ["State minimal", "Komponen dikendalikan dari luar lewat properti seperti <i>value</i>, <i>onChange</i>, "
              "<i>error</i>, dan <i>loading</i>. Komponen tidak menyimpan data sendiri."],
             ["Variasi tertulis", "Variasi dan ukuran Button ditulis di dokumen ini, bukan hanya diingat."],
             ["Satu sumber gaya", "Warna, jarak, dan sudut diambil dari variabel CSS di <i>src/styles/variables.css</i>.",]],
            [4.2 * cm, 11.8 * cm])]

s += [P("3. Konsistensi dengan Style Guide", H),
      P("Semua gaya komponen ditulis di <i>src/styles/components.css</i> dan hanya memakai variabel dari "
        "<i>variables.css</i>. Tidak ada kode warna yang ditulis langsung di komponen."),
      Spacer(1, 4),
      table([["Aspek", "Variabel", "Nilai", "Dipakai untuk"],
             ["Warna utama", "--color-primary", "#2563eb", "Tombol primary, garis fokus kolom"],
             ["Warna utama saat disentuh", "--color-primary-dark, --color-primary-pressed", "#1d4ed8, #1e40af",
              "State hover dan pressed Button"],
             ["Warna sekunder", "--color-secondary", "#dbeafe", "Latar Button secondary"],
             ["Bahaya", "--color-danger, --color-late", "#dc2626, #991b1b", "Button danger, pesan error, garis merah kolom"],
             ["Abu-abu", "--gray-200, --gray-300, --gray-600", "#e5e7eb, #d1d5db, #4b5563",
              "Garis Card, Button disabled"],
             ["Jarak 8-point", "--space-1 sampai --space-6", "8, 16, 24, 32, 48 px", "Padding dan jarak antarelemen"],
             ["Sudut", "--radius", "12 px", "Button, Card, kolom isian"],
             ["Huruf", "--font-main", "Inter", "Semua teks komponen"]],
            [3.4 * cm, 4.6 * cm, 3.2 * cm, 4.8 * cm])]

# ---------------- Button ----------------
s += [P("4. Button", H),
      P("Tombol untuk aksi, misalnya menyimpan. Jika diberi properti <i>to</i>, Button tampil sebagai tombol "
        "tetapi berfungsi sebagai tautan ke layar lain. Berkas: <i>src/components/Button.tsx</i>."),
      P("Properti", H2),
      table([["Properti", "Tipe", "Wajib atau opsional", "Bawaan", "Keterangan"],
             ["children", "isi (teks atau elemen)", "Wajib", "-", "Isi tombol."],
             ["variant", "primary, secondary, danger", "Opsional", "primary", "Tampilan tombol."],
             ["size", "sm, md, lg", "Opsional", "md", "Tinggi tombol: 40, 48, dan 56 px."],
             ["fullWidth", "true atau false", "Opsional", "false", "Tombol selebar wadahnya."],
             ["loading", "true atau false", "Opsional", "false", "Teks menjadi \"Memproses...\" dan tombol tidak bisa ditekan."],
             ["disabled", "true atau false", "Opsional", "false", "Tombol tidak bisa ditekan."],
             ["type", "button, submit, reset", "Opsional", "button", "Untuk mengirim form, isi submit."],
             ["to", "alamat layar", "Opsional", "-", "Jika diisi, Button menjadi tautan. Contoh: \"/tambah\"."],
             ["Atribut lain", "atribut tombol HTML", "Opsional", "-", "Misalnya onClick, form, dan aria-label, diteruskan apa adanya."]],
            PROP),
      P("Variasi dan ukuran", H2),
      table([["Nama", "Tampilan", "Dipakai untuk"],
             ["primary", "Latar biru utama, teks putih", "Aksi utama di sebuah layar, misalnya Simpan Tugas"],
             ["secondary", "Latar biru muda, teks biru tua", "Aksi pendukung, misalnya Batal"],
             ["danger", "Latar merah, teks putih", "Aksi berisiko, misalnya hapus"],
             ["sm, md, lg", "Tinggi 40, 48, 56 px", "md sebagai bawaan agar mudah disentuh di ponsel"]],
            [3 * cm, 5.5 * cm, 7.5 * cm]),
      P("State", H2),
      table([["State", "Tampilan", "Cara memunculkan"],
             ["Default", "Warna sesuai variasi", "Tanpa properti tambahan"],
             ["Hover", "Warna sedikit lebih gelap", "Kursor di atas tombol"],
             ["Pressed", "Warna paling gelap", "Tombol ditekan"],
             ["Focus", "Garis biru tebal di sekeliling tombol", "Berpindah dengan tombol Tab"],
             ["Disabled", "Latar abu-abu, kursor tanda dilarang", "disabled={true}"],
             ["Loading", "Teks \"Memproses...\", tombol nonaktif, kursor menunggu", "loading={true}"]],
            [3 * cm, 7 * cm, 6 * cm]),
      P("Contoh pemakaian", H2),
      code('''
// Tombol tautan di Beranda
<Button to="/tambah" fullWidth>
  <Icon name="plus" /> Tambah Tugas
</Button>

// Tombol kirim form (tombol di luar form, dihubungkan lewat id)
<Button type="submit" form="task-form" fullWidth>
  Simpan Tugas
</Button>

// Tombol dengan state loading
<Button loading={sedangKirim} onClick={kirim}>Masuk</Button>
''', W),
      P("Batasan", H2),
      P("Saat memakai <i>to</i>, properti <i>loading</i> dan <i>disabled</i> tidak berlaku karena tautan tidak "
        "bisa dinonaktifkan. Button tidak mendukung ikon lewat properti khusus, jadi ikon dimasukkan sebagai isi. "
        "Tombol hanya punya tiga variasi dan tiga ukuran, tidak ada warna bebas.")]

# ---------------- Card ----------------
s += [P("5. Card", H),
      P("Pembungkus isi dengan latar putih, garis tepi tipis, dan sudut membulat. Berkas: "
        "<i>src/components/Card.tsx</i>."),
      P("Properti", H2),
      table([["Properti", "Tipe", "Wajib atau opsional", "Bawaan", "Keterangan"],
             ["children", "isi", "Wajib", "-", "Isi kartu."],
             ["as", "section, article, div, li", "Opsional", "section", "Elemen HTML pembungkus. Pakai li bila kartu ada di dalam daftar."],
             ["title", "teks", "Opsional", "tidak ada", "Judul kartu."],
             ["footer", "isi", "Opsional", "tidak ada", "Bagian bawah kartu, misalnya tombol."],
             ["className", "teks", "Opsional", "tidak ada", "Kelas tambahan untuk mengatur tata letak isi."]],
            PROP),
      P("Variasi dan state", H2),
      P("Card punya tiga bentuk: tanpa judul (dipakai kartu tugas), dengan judul, dan dengan bagian bawah. "
        "Card tidak punya state sendiri. Perubahan seperti tugas selesai diatur oleh isinya, bukan oleh Card."),
      P("Contoh pemakaian", H2),
      code('''
// Kartu tugas di Beranda (src/components/TaskCard.tsx)
<Card as="li" className="task-card">
  <button ...>lingkaran selesai</button>
  <Link ...>judul dan badge</Link>
</Card>

// Kartu dengan judul dan bagian bawah
<Card title="Masuk" footer={<Button>Daftar</Button>}>
  <FormField id="email" label="Email" type="email" />
</Card>
''', W),
      P("Batasan", H2),
      P("Card tidak menangani klik dan tidak punya variasi warna. Judul selalu berupa teks biasa. "
        "Jika <i>as=\"li\"</i>, Card harus berada di dalam daftar (<i>ul</i> atau <i>ol</i>).")]

# ---------------- FormField ----------------
s += [P("6. FormField", H),
      P("Satu kolom isian lengkap: label, penanda Wajib atau Opsional, kolom, petunjuk, dan pesan kesalahan. "
        "Label otomatis terhubung ke kolom lewat <i>id</i>. Berkas: <i>src/components/FormField.tsx</i>."),
      P("Properti", H2),
      table([["Properti", "Tipe", "Wajib atau opsional", "Bawaan", "Keterangan"],
             ["id", "teks", "Wajib", "-", "Menghubungkan label dengan kolom."],
             ["label", "teks", "Wajib", "-", "Teks label di atas kolom."],
             ["requirement", "wajib atau opsional", "Opsional", "tidak tampil", "Penanda di kanan label."],
             ["helper", "isi", "Opsional", "tidak ada", "Petunjuk di bawah kolom. Tidak tampil bila ada error."],
             ["error", "teks", "Opsional", "tidak ada", "Pesan kesalahan. Kolom diberi garis merah dan ikon peringatan."],
             ["control", "input, textarea, select, custom", "Opsional", "input", "Jenis kolom."],
             ["options", "daftar value dan label", "Wajib untuk select", "-", "Pilihan pada kolom pilih."],
             ["placeholder", "teks", "Opsional", "-", "Pada select, menjadi pilihan pertama yang kosong."],
             ["children", "isi", "Wajib untuk custom", "-", "Kolom buatan sendiri, misalnya kolom tanggal."],
             ["Atribut lain", "atribut kolom HTML", "Opsional", "-", "Misalnya value, onChange, rows, type, dan placeholder."]],
            PROP),
      P("Variasi", H2),
      table([["control", "Dipakai untuk", "Contoh di TugasKu"],
             ["input", "Teks satu baris", "Nama tugas"],
             ["select", "Memilih satu dari daftar", "Mata kuliah"],
             ["textarea", "Teks beberapa baris", "Catatan"],
             ["custom", "Kolom dengan tampilan khusus", "Tanggal tenggat"]],
            [3 * cm, 6 * cm, 7 * cm]),
      P("State", H2),
      table([["State", "Tampilan", "Cara memunculkan"],
             ["Default", "Garis abu-abu", "Tanpa properti tambahan"],
             ["Fokus", "Garis biru tebal", "Kolom diklik atau dipilih dengan Tab"],
             ["Helper", "Teks petunjuk di bawah kolom", "helper diisi"],
             ["Error", "Garis merah, ikon peringatan, dan pesan di bawah kolom", "error diisi"],
             ["Disabled", "Diteruskan ke kolom HTML, belum diberi gaya khusus", "disabled={true}"]],
            [3 * cm, 7 * cm, 6 * cm]),
      P("Contoh pemakaian", H2),
      code('''
<FormField
  id="title"
  label="Nama tugas"
  requirement="wajib"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Contoh: Laporan Praktikum"
  error={errors.title}
/>

<FormField
  control="select"
  id="course"
  label="Mata kuliah"
  requirement="opsional"
  placeholder="Pilih mata kuliah"
  options={[{ value: "Agama", label: "Agama" }]}
  value={course}
  onChange={(e) => setCourse(e.target.value)}
/>
''', W),
      P("Batasan", H2),
      P("FormField tidak menyimpan nilai dan tidak memeriksa isian. Nilai dan pesan kesalahan harus diberikan "
        "dari luar. Pilihan satu-dari-dua seperti Jenis tugas (Individu atau Kelompok) belum didukung, "
        "jadi layar Tambah Tugas masih memakai kelompok pilihan sendiri. Pada <i>control=\"custom\"</i>, "
        "pemakai harus memasang kolom dengan <i>id</i> yang sama dan mengatur tampilan error sendiri.")]

# ---------------- Penerapan ----------------
s += [P("7. Penerapan di Layar", H),
      P("Komponen yang tidak dipakai di layar mana pun belum terbukti reusable. Karena itu kami mengganti "
        "tombol, kartu, dan kolom isian lama di skeleton Pertemuan 4 dengan komponen baru."),
      Spacer(1, 4),
      table([["Komponen", "Berkas pemakai", "Layar", "Jumlah pemakaian"],
             ["Button", "HomePage.tsx", "Beranda: tombol Tambah Tugas (tautan)", "1"],
             ["Button", "TaskFormPage.tsx", "Tambah Tugas dan Ubah Tugas: Simpan Tugas dan Simpan Perubahan", "1 (dua layar)"],
             ["Button", "NotFoundPage.tsx", "Halaman tidak ditemukan: Kembali ke Beranda (tautan)", "1"],
             ["Card", "TaskCard.tsx", "Beranda: setiap tugas", "1 per tugas"],
             ["FormField", "TaskFormPage.tsx", "Tambah Tugas dan Ubah Tugas: nama tugas, mata kuliah, tanggal tenggat, catatan", "4 (dua layar)"]],
            [2.9 * cm, 3.6 * cm, 6.7 * cm, 2.8 * cm]),
      Spacer(1, 6),
      P("Yang sudah disiapkan tetapi belum dipakai di layar MVP: variasi <i>secondary</i> dan <i>danger</i>, "
        "ukuran <i>sm</i> dan <i>lg</i>, serta judul dan bagian bawah pada Card. Semuanya kami siapkan untuk "
        "layar berikutnya, misalnya tombol hapus dan layar Profil.")]

s += [P("8. Cara Memakai", H),
      P("1. Impor komponen dari <i>src/components</i>, misalnya <i>import { Button } from '../components/Button'</i>.", LEFT),
      P("2. Isi properti yang wajib, lalu tambahkan properti opsional bila perlu.", LEFT),
      P("3. Jangan menulis warna atau jarak baru di komponen. Ubah variabel di <i>src/styles/variables.css</i> "
        "agar semua komponen ikut berubah.", LEFT),
      P("4. Bila membutuhkan variasi baru, tambahkan di <i>components.css</i> dan catat di dokumen ini.", LEFT)]

s.append(KeepTogether([P("Penggunaan AI", H),
      P("Rancangan komponen, pilihan properti, dan keputusan penerapan di layar berasal dari kelompok kami, dan "
        "seluruh isi sudah kami periksa bersama. Kami memakai Claude (Anthropic) hanya sebagai alat bantu untuk "
        "menyusun kode awal komponen dan merapikan bahasa dokumen ini sesuai arahan kami.")]))

build(OUT, s, title="Tugas 5b - Komponen Reusable")
print("OK", OUT)
