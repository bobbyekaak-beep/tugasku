import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { Icon } from '../components/Icon';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';
import {
  dotTone,
  groupByDate,
  MONTH_NAMES,
  monthGrid,
  WEEKDAYS,
} from '../utils/calendar';
import {
  formatDateLong,
  getDeadlineStatus,
  parseDate,
  toDateString,
} from '../utils/deadline';

export function CalendarPage() {
  const { tasks, toggleDone } = useTasks();
  const { openTaskForm } = useUI();
  const [params] = useSearchParams();
  const now = new Date();
  const todayStr = toDateString(now);

  const fromUrl = params.get('tanggal');
  const initial = fromUrl && /^\d{4}-\d{2}-\d{2}$/.test(fromUrl) ? fromUrl : todayStr;
  const [selected, setSelected] = useState(initial);
  const initialDate = parseDate(initial);
  const [cursor, setCursor] = useState({
    y: initialDate.getFullYear(),
    m: initialDate.getMonth(),
  });

  const byDate = groupByDate(tasks);
  const dayTasks = byDate.get(selected) ?? [];

  function shift(delta: number) {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  }

  function goToday() {
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setSelected(todayStr);
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Kalender</h1>
          <p className="page-sub">Lihat tenggat tugas berdasarkan tanggal.</p>
        </div>
        <Button onClick={() => openTaskForm({ date: selected })}>
          <Icon name="plus" size={20} /> Tambah Tugas
        </Button>
      </div>

      <div className="cal-layout">
        <section className="glass card big-cal" aria-label="Kalender bulanan">
          <div className="big-cal-nav">
            <div className="month-pill month-pill-lg">
              <button
                type="button"
                aria-label="Bulan sebelumnya"
                onClick={() => shift(-1)}
              >
                <Icon name="chevronLeft" size={20} />
              </button>
              <span aria-live="polite">
                {MONTH_NAMES[cursor.m]} {cursor.y}
              </span>
              <button
                type="button"
                aria-label="Bulan berikutnya"
                onClick={() => shift(1)}
              >
                <Icon name="chevronRight" size={20} />
              </button>
            </div>
            <button type="button" className="soft-btn" onClick={goToday}>
              Hari Ini
            </button>
          </div>

          <div className="big-grid big-head" aria-hidden="true">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="big-grid">
            {monthGrid(cursor.y, cursor.m).map((date) => {
              const key = toDateString(date);
              const items = byDate.get(key) ?? [];
              const outside = date.getMonth() !== cursor.m;
              const tone = dotTone(items, now);
              return (
                <button
                  key={key}
                  type="button"
                  className={`big-day ${outside ? 'is-outside' : ''} ${key === selected ? 'is-selected' : ''} ${key === todayStr ? 'is-today' : ''}`}
                  aria-label={`${date.getDate()} ${MONTH_NAMES[date.getMonth()]}, ${items.length} tugas`}
                  aria-pressed={key === selected}
                  onClick={() => setSelected(key)}
                >
                  <span className="big-num">{date.getDate()}</span>
                  {tone && <i className={`dot dot-${tone} big-dot`} />}
                  <span className="big-chips">
                    {items.slice(0, 2).map((t) => (
                      <em
                        key={t.id}
                        className={`mini-chip tone-${getDeadlineStatus(t.dueDate, t.done).tone}`}
                      >
                        {t.title}
                      </em>
                    ))}
                    {items.length > 2 && (
                      <em className="mini-more">+{items.length - 2} lagi</em>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className="glass card day-panel"
          aria-label="Tugas pada tanggal terpilih"
        >
          <h2 className="h-small">{formatDateLong(selected)}</h2>
          {dayTasks.length === 0 ? (
            <p className="empty">Tidak ada tugas di tanggal ini.</p>
          ) : (
            <ul className="day-list">
              {dayTasks.map((t) => (
                <li
                  key={t.id}
                  className={`upcoming tone-${getDeadlineStatus(t.dueDate, t.done).tone}`}
                >
                  <button
                    type="button"
                    className={`check-circle ${t.done ? 'is-done' : ''}`}
                    aria-label={
                      t.done
                        ? `Batalkan selesai: ${t.title}`
                        : `Tandai selesai: ${t.title}`
                    }
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
                    <span className={`upcoming-title ${t.done ? 'is-done' : ''}`}>
                      {t.title} <DeadlineBadge dueDate={t.dueDate} done={t.done} />
                    </span>
                    <span className="upcoming-note">{t.course || `Tugas ${t.type}`}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Button
            variant="secondary"
            fullWidth
            onClick={() => openTaskForm({ date: selected })}
          >
            <Icon name="plus" size={18} /> Tambah tugas di tanggal ini
          </Button>
        </section>
      </div>
    </div>
  );
}
