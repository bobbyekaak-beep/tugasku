import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { Icon } from '../components/Icon';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';
import { daysLeft, formatDate, getDeadlineStatus } from '../utils/deadline';

type Filter = 'semua' | 'belum' | 'terlambat' | 'selesai';
type Sort = 'dekat' | 'jauh' | 'nama';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'belum', label: 'Belum Selesai' },
  { key: 'terlambat', label: 'Terlambat' },
  { key: 'selesai', label: 'Selesai' },
];

export function TasksPage() {
  const { tasks, toggleDone, deleteTask, removeFile } = useTasks();
  const { openTaskForm, openUpload, confirm, toast } = useUI();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('dekat');

  const raw = params.get('filter');
  const filter: Filter = FILTERS.some((f) => f.key === raw) ? (raw as Filter) : 'semua';

  const matches = (f: Filter, t: (typeof tasks)[number]) =>
    f === 'semua' ||
    (f === 'belum' && !t.done) ||
    (f === 'selesai' && t.done) ||
    (f === 'terlambat' && !t.done && daysLeft(t.dueDate) < 0);

  const q = query.trim().toLowerCase();
  const list = tasks
    .filter((t) => matches(filter, t))
    .filter((t) => !q || `${t.title} ${t.course} ${t.notes}`.toLowerCase().includes(q))
    .sort((a, b) => {
      // Tugas yang belum selesai selalu di atas, lalu urut sesuai pilihan.
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (sort === 'nama') return a.title.localeCompare(b.title);
      return sort === 'jauh'
        ? b.dueDate.localeCompare(a.dueDate)
        : a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Tugas</h1>
          <p className="page-sub">Kelola semua tugas kuliahmu di satu tempat.</p>
        </div>
        <Button onClick={() => openTaskForm()}>
          <Icon name="plus" size={20} /> Tambah Tugas
        </Button>
      </div>

      <section className="glass card">
        <div className="toolbar">
          <div className="chips" role="tablist" aria-label="Filter tugas">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                className={`chip ${filter === f.key ? 'is-active' : ''}`}
                onClick={() => setParams(f.key === 'semua' ? {} : { filter: f.key })}
              >
                {f.label}
                <span>{tasks.filter((t) => matches(f.key, t)).length}</span>
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <label className="search">
              <Icon name="search" size={18} />
              <input
                type="search"
                placeholder="Cari tugas..."
                aria-label="Cari tugas"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="select-wrap select-sm">
              <select
                className="input"
                aria-label="Urutkan tugas"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
              >
                <option value="dekat">Tenggat terdekat</option>
                <option value="jauh">Tenggat terjauh</option>
                <option value="nama">Nama A-Z</option>
              </select>
              <Icon name="chevronDown" size={16} />
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="empty">
            {tasks.length === 0
              ? 'Belum ada tugas. Tekan “Tambah Tugas” untuk mulai.'
              : 'Tidak ada tugas yang cocok dengan filter ini.'}
          </p>
        ) : (
          <ul className="task-rows">
            {list.map((t) => (
              <li
                key={t.id}
                className={`task-row tone-${getDeadlineStatus(t.dueDate, t.done).tone}`}
              >
                <button
                  type="button"
                  className={`check-circle ${t.done ? 'is-done' : ''}`}
                  aria-label={
                    t.done ? `Batalkan selesai: ${t.title}` : `Tandai selesai: ${t.title}`
                  }
                  onClick={() => toggleDone(t.id)}
                >
                  <Icon name="check" size={16} />
                </button>

                <div className="task-info">
                  <p className={`task-title ${t.done ? 'is-done' : ''}`}>
                    {t.title} <DeadlineBadge dueDate={t.dueDate} done={t.done} />
                  </p>
                  <p className="task-meta">
                    <span>{t.course || 'Tanpa mata kuliah'}</span>
                    <span>Tugas {t.type}</span>
                    <span>
                      <Icon name="calendar" size={15} /> {formatDate(t.dueDate)}
                    </span>
                  </p>
                  {t.notes && <p className="task-notes">{t.notes}</p>}
                  {t.files.length > 0 && (
                    <ul className="file-chips">
                      {t.files.map((f) => (
                        <li key={f.name}>
                          <Icon name="file" size={14} /> {f.name}
                          <button
                            type="button"
                            aria-label={`Hapus file ${f.name}`}
                            onClick={() => removeFile(t.id, f.name)}
                          >
                            <Icon name="close" size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Upload file untuk ${t.title}`}
                    onClick={() => openUpload(t.id)}
                  >
                    <Icon name="upload" size={20} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Ubah ${t.title}`}
                    onClick={() => openTaskForm({ taskId: t.id })}
                  >
                    <Icon name="edit" size={20} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    aria-label={`Hapus ${t.title}`}
                    onClick={() =>
                      confirm({
                        title: 'Hapus tugas?',
                        message: `Tugas “${t.title}” akan dihapus dan tidak bisa dikembalikan.`,
                        confirmLabel: 'Hapus',
                        danger: true,
                        onConfirm: () => {
                          deleteTask(t.id);
                          toast('Tugas dihapus');
                        },
                      })
                    }
                  >
                    <Icon name="trash" size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
