import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="screen not-found">
      <h2>Halaman tidak ditemukan</h2>
      <p>Alamat yang kamu buka tidak ada di TugasKu.</p>
      <Link to="/" className="btn">
        Kembali ke Beranda
      </Link>
    </section>
  );
}
