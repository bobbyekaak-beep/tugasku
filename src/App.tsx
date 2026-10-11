import { Route, Routes, useLocation } from 'react-router-dom';
import { DeviceFrame } from './components/DeviceFrame';
import { HomePage } from './pages/HomePage';
import { TaskFormPage } from './pages/TaskFormPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tambah" element={<TaskFormPage />} />
        <Route path="/ubah/:id" element={<TaskFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DeviceFrame>
  );
}
