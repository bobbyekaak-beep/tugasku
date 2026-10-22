import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

const disabledItems: { label: string; icon: IconName }[] = [
  { label: 'Tugas', icon: 'tasks' },
  { label: 'Kalender', icon: 'calendar' },
  { label: 'Profil', icon: 'user' },
];

/** Di skeleton ini hanya Beranda yang aktif. Menu lain menyusul setelah MVP. */
export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
      >
        <span className="nav-pill">
          <Icon name="home" size={28} />
        </span>
        <span className="nav-label">Beranda</span>
      </NavLink>
      {disabledItems.map((item) => (
        <span key={item.label} className="nav-item" aria-disabled="true">
          <span className="nav-pill">
            <Icon name={item.icon} size={28} />
          </span>
          <span className="nav-label">{item.label}</span>
        </span>
      ))}
    </nav>
  );
}
