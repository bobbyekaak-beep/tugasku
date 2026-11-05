import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <section className="glass card not-found">
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang kamu buka tidak ada di TugasKu.</p>
      <Button to="/">Kembali ke Beranda</Button>
    </section>
  );
}
