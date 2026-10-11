import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { Icon } from '../components/Icon';
import { daysLeft } from '../utils/deadline';

export function HomePage() {
  const { tasks } = useTasks();

  // Urutkan dari tenggat paling dekat. Tugas selesai ditaruh di bawah.
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  // Prioritas: belum selesai dan sisa hari 3 atau kurang (termasuk yang terlambat).
  const priority = sorted.filter((t) => !t.done && daysLeft(t.dueDate) <= 3);
  const others = sorted.filter((t) => !priority.includes(t));

  return (
    <>
      <section className="screen">
        <div className="greeting">
          <span className="avatar">
            <Icon name="user" />
          </span>
          <div>
            <h2>Halo, Atsalatsa</h2>
            <p className="caption">Selamat mengerjakan.</p>
          </div>
        </div>

        <h3>Prioritas Mendekati Tenggat</h3>
        {priority.length === 0 ? (
          <p className="caption">Belum ada tugas yang mendekati tenggat.</p>
        ) : (
          <ul className="task-list">
            {priority.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </ul>
        )}

        <h4>Daftar Tugas Lainnya</h4>
        {others.length === 0 ? (
          <p className="caption">Belum ada tugas lain.</p>
        ) : (
          <ul className="task-list">
            {others.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </ul>
        )}
      </section>

      {/* Tombol tetap di bawah layar dan tidak ikut bergeser saat daftar di-scroll. */}
      <div className="action-bar">
        <Link to="/tambah" className="btn btn-full">
          <Icon name="plus" /> Tambah Tugas
        </Link>
      </div>
    </>
  );
}
