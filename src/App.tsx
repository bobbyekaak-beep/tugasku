import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { DeviceFrame } from './components/DeviceFrame';
import { HomePage } from './pages/HomePage';

// Layar ini dimuat hanya saat dibuka (code-splitting per rute).
const TaskFormPage = lazy(() =>
  import('./pages/TaskFormPage').then((m) => ({ default: m.TaskFormPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function getScreenName(pathname: string): string {
  if (pathname === '/') return 'Beranda';
  if (pathname === '/tambah') return 'Tambah Tugas';
  if (pathname.startsWith('/ubah/')) return 'Ubah Tugas';
  return 'Halaman Tidak Ditemukan';
}

export default function App() {
  const { pathname } = useLocation();
  // Layar form tidak memakai navigasi bawah, sama seperti mockup Tambah Tugas.
  const isForm = pathname === '/tambah' || pathname.startsWith('/ubah/');

  return (
    <DeviceFrame screenName={getScreenName(pathname)} withNav={!isForm}>
      <Suspense
        fallback={
          <section className="screen">
            <p className="caption">Memuat...</p>
          </section>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tambah" element={<TaskFormPage />} />
          <Route path="/ubah/:id" element={<TaskFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </DeviceFrame>
  );
}
