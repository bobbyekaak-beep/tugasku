import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LogoMark } from '../components/Illustrations';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { useApp } from '../context/AppContext';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';
import { daysLeft } from '../utils/deadline';

/** Menutup popover saat klik di luar atau menekan Esc. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

export function Topbar() {
  const { profile, settings, logout } = useApp();
  const { tasks } = useTasks();
  const { confirm } = useUI();
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const bellRef = useDismiss(bellOpen, () => setBellOpen(false));
  const userRef = useDismiss(userOpen, () => setUserOpen(false));

  // Pengingat: tugas belum selesai yang terlambat atau tenggatnya hari ini dan besok.
  const reminders = tasks
    .filter((t) => !t.done && daysLeft(t.dueDate) <= 1)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const showDot = settings.reminders && reminders.length > 0;

  return (
    <header className="topbar">
      <Link to="/" className="topbar-brand" aria-label="TugasKu, ke Beranda">
        <LogoMark size={34} />
        <span>TugasKu</span>
      </Link>

      <div className="topbar-right">
        <div className="popover-wrap" ref={bellRef}>
          <button
            type="button"
            className="icon-btn bell"
            aria-label={
              showDot ? `Notifikasi, ${reminders.length} pengingat` : 'Notifikasi'
            }
            aria-expanded={bellOpen}
            onClick={() => {
              setBellOpen((v) => !v);
              setUserOpen(false);
            }}
          >
            <Icon name="bell" size={24} />
            {showDot && <span className="bell-dot" />}
          </button>
          {bellOpen && (
            <div className="popover popover-wide" role="dialog" aria-label="Notifikasi">
              <p className="popover-title">Pengingat tenggat</p>
              {!settings.reminders ? (
                <p className="caption popover-empty">
                  Pengingat dimatikan di Pengaturan.
                </p>
              ) : reminders.length === 0 ? (
                <p className="caption popover-empty">
                  Tidak ada tugas yang mendesak. Aman!
                </p>
              ) : (
                <ul className="reminder-list">
                  {reminders.map((t) => (
                    <li key={t.id}>
                      <Link to="/tugas?filter=belum" onClick={() => setBellOpen(false)}>
                        <span>{t.title}</span>
                        <DeadlineBadge dueDate={t.dueDate} done={false} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="popover-wrap" ref={userRef}>
          <button
            type="button"
            className="user-btn"
            aria-expanded={userOpen}
            aria-haspopup="menu"
            onClick={() => {
              setUserOpen((v) => !v);
              setBellOpen(false);
            }}
          >
            <span className="avatar">
              <Icon name="user" size={20} />
            </span>
            <span className="user-name">{profile.displayName}</span>
            <Icon name="chevronDown" size={16} />
          </button>
          {userOpen && (
            <div className="popover" role="menu">
              <Link role="menuitem" to="/profil" onClick={() => setUserOpen(false)}>
                <Icon name="user" size={18} /> Profil
              </Link>
              <Link role="menuitem" to="/pengaturan" onClick={() => setUserOpen(false)}>
                <Icon name="settings" size={18} /> Pengaturan
              </Link>
              <button
                role="menuitem"
                type="button"
                className="danger"
                onClick={() => {
                  setUserOpen(false);
                  confirm({
                    title: 'Keluar dari TugasKu?',
                    message: 'Data tugasmu tetap tersimpan di perangkat ini.',
                    confirmLabel: 'Keluar',
                    danger: true,
                    onConfirm: logout,
                  });
                }}
              >
                <Icon name="logout" size={18} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
