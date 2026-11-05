import { useNavigate } from 'react-router-dom';
import { ActivityList } from '../components/ActivityList';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { HeroIllustration } from '../components/Illustrations';
import { Icon, type IconName } from '../components/Icon';
import { MiniCalendar } from '../components/MiniCalendar';
import { useApp } from '../context/AppContext';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';
import { formatDate, getDeadlineStatus } from '../utils/deadline';

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

export function HomePage() {
  const { tasks, activities, toggleDone } = useTasks();
  const { profile } = useApp();
  const { openTaskForm, openUpload, openActivities } = useUI();
  const navigate = useNavigate();

  const pending = tasks
    .filter((t) => !t.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcoming = pending.slice(0, 3);
  const total = tasks.length;
  const doneCount = total - pending.length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const quick: { label: string; icon: IconName; run: () => void }[] = [
    { label: 'Tambah Tugas', icon: 'plus', run: () => openTaskForm() },
    { label: 'Upload File', icon: 'upload', run: () => openUpload() },
    { label: 'Lihat Kalender', icon: 'calendar', run: () => navigate('/kalender') },
    { label: 'Profil', icon: 'user', run: () => navigate('/profil') },
  ];

  return (
    <div className="home-grid">
      <div className="col-main">
        <section className="glass hero">
          <div className="hero-text">
            <h1>Halo, {profile.displayName}!</h1>
            <p>
              {pending.length === 0
                ? 'Hebat! Semua tugasmu sudah selesai. Waktunya istirahat.'
                : 'Semangat ya! Jangan lupa selesaikan tugas yang mendekati deadline.'}
            </p>
          </div>
          <HeroIllustration />
        </section>

        <section className="glass card" aria-labelledby="h-upcoming">
          <div className="card-head">
            <h2 id="h-upcoming">
              <Icon name="clock" size={26} className="head-icon" /> Tugas Mendatang
            </h2>
            <button
              type="button"
              className="text-link"
              onClick={() => navigate('/tugas?filter=belum')}
            >
              Lihat Semua <Icon name="arrowRight" size={18} />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <p className="empty">
              Belum ada tugas yang menunggu. Tambahkan tugas baru lewat Aksi Cepat.
            </p>
          ) : (
            <ul className="upcoming-list">
              {upcoming.map((t) => {
                const { tone } = getDeadlineStatus(t.dueDate, t.done);
                return (
                  <li key={t.id} className={`upcoming tone-${tone}`}>
                    <button
                      type="button"
                      className="check-circle"
                      aria-label={`Tandai selesai: ${t.title}`}
                      onClick={() => toggleDone(t.id)}
                    >
                      <Icon name="check" size={16} />
                    </button>
                    <button
                      type="button"
                      className="upcoming-main"
                      aria-label={`Ubah tugas ${t.title}`}
                      onClick={() => openTaskForm({ taskId: t.id })}
                    >
                      <span className="upcoming-title">
                        {t.title} <DeadlineBadge dueDate={t.dueDate} done={t.done} />
                      </span>
                      <span className="upcoming-note">
                        {t.notes || `Tugas ${t.type}`}
                      </span>
                    </button>
                    <span className="upcoming-date">
                      <Icon name="calendar" size={18} />
                      {formatDate(t.dueDate)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="glass card" aria-labelledby="h-summary">
          <div className="card-head">
            <h2 id="h-summary" className="h-small">
              <Icon name="chart" size={22} className="head-icon" /> Ringkasan Tugas
            </h2>
          </div>
          <div className="summary">
            <div
              className="ring"
              role="img"
              aria-label={`${percent} persen tugas selesai`}
            >
              <svg viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#5b8def" />
                    <stop offset="1" stopColor="#2457e6" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r={RADIUS} className="ring-track" />
                <circle
                  cx="60"
                  cy="60"
                  r={RADIUS}
                  className="ring-value"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - percent / 100)}
                />
              </svg>
              <strong>{percent}%</strong>
            </div>

            <div className="summary-text">
              <h3>Tugas Selesai</h3>
              <p>
                {doneCount} dari {total} tugas
              </p>
            </div>

            <dl className="legend">
              <div>
                <dt>
                  <i className="legend-dot is-done" /> Selesai
                </dt>
                <dd>{doneCount}</dd>
              </div>
              <div>
                <dt>
                  <i className="legend-dot" /> Belum Selesai
                </dt>
                <dd>{pending.length}</dd>
              </div>
            </dl>

            <div
              className="bar"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progres tugas selesai"
            >
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        </section>
      </div>

      <div className="col-side">
        <section className="glass card" aria-labelledby="h-quick">
          <div className="card-head">
            <h2 id="h-quick" className="h-small">
              Aksi Cepat
            </h2>
          </div>
          <div className="quick">
            {quick.map((q) => (
              <button key={q.label} type="button" className="quick-tile" onClick={q.run}>
                <span className="quick-icon">
                  <Icon name={q.icon} size={26} />
                </span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="glass card" aria-labelledby="h-cal">
          <div className="card-head">
            <h2 id="h-cal" className="h-small">
              <Icon name="calendar" size={24} className="head-icon" /> Kalender
            </h2>
          </div>
          <MiniCalendar
            tasks={tasks}
            onPick={(date) => navigate(`/kalender?tanggal=${date}`)}
            onDetail={() => navigate('/kalender')}
          />
        </section>

        <section className="glass card" aria-labelledby="h-act">
          <div className="card-head">
            <h2 id="h-act" className="h-small">
              <Icon name="clock" size={22} className="head-icon" /> Aktivitas Terbaru
            </h2>
            <button
              type="button"
              className="text-link text-link-sm"
              onClick={openActivities}
            >
              Lihat Semua <Icon name="arrowRight" size={16} />
            </button>
          </div>
          <ActivityList items={activities.slice(0, 3)} />
        </section>
      </div>
    </div>
  );
}
