import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <section className="screen not-found">
      <h2>Halaman tidak ditemukan</h2>
      <p>Alamat yang kamu buka tidak ada di TugasKu.</p>
      <Button to="/">Kembali ke Beranda</Button>
    </section>
  );
}
