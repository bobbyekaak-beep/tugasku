import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UIProvider } from '../context/UIContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/** Kerangka halaman: sidebar kiri, topbar, lalu isi halaman. Hanya untuk pengguna yang sudah masuk. */
export function AppShell() {
  const { loggedIn } = useApp();
  if (!loggedIn) return <Navigate to="/masuk" replace />;

  return (
    <UIProvider>
      <div className="frame">
        <Sidebar />
        <div className="main-col">
          <Topbar />
          <main className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </UIProvider>
  );
}
