import { NavLink } from 'react-router-dom';
import { BooksIllustration, LogoMark } from '../components/Illustrations';
import { Icon, type IconName } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';

const ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Beranda', icon: 'home', end: true },
  { to: '/tugas', label: 'Tugas', icon: 'tasks' },
  { to: '/kalender', label: 'Kalender', icon: 'calendar' },
  { to: '/profil', label: 'Profil', icon: 'user' },
  { to: '/pengaturan', label: 'Pengaturan', icon: 'settings' },
];

/** Di layar lebar menjadi sidebar kiri; di HP menjadi navigasi bawah (lewat CSS). */
export function Sidebar() {
  const { logout } = useApp();
  const { confirm } = useUI();

  return (
    <aside className="sidebar">
      <div className="brand">
        <LogoMark />
        <span className="brand-name">TugasKu</span>
      </div>

      <nav className="side-nav" aria-label="Navigasi utama">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
          >
            <Icon name={item.icon} size={24} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className="nav-item nav-logout"
          onClick={() =>
            confirm({
              title: 'Keluar dari TugasKu?',
              message: 'Data tugasmu tetap tersimpan di perangkat ini.',
              confirmLabel: 'Keluar',
              danger: true,
              onConfirm: logout,
            })
          }
        >
          <Icon name="logout" size={24} />
          <span>Keluar</span>
        </button>
      </nav>

      <BooksIllustration />
    </aside>
  );
}
