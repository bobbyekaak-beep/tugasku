import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/Button';
import { TaskCard } from '../components/TaskCard';
import { Icon } from '../components/Icon';
import { daysLeft } from '../utils/deadline';

const HINT_KEY = 'tugasku-hint-dismissed';

/** Petunjuk hanya tampil sampai ditutup. Pilihan disimpan, tetapi aplikasi tetap jalan bila penyimpanan tidak tersedia. */
function readHintVisible(): boolean {
  try {
    return localStorage.getItem(HINT_KEY) !== '1';
  } catch {
    return true;
  }
}

function SectionHead({
  title,
  sub,
  count,
}: {
  title: string;
  sub: string;
  count: number;
}) {
  return (
    <div className="section-head">
      <div>
        <h3>{title}</h3>
        <p className="section-sub">{sub}</p>
      </div>
      <span className="count-pill" aria-label={`${count} tugas`}>
        {count}
      </span>
    </div>
  );
}

export function HomePage() {
  const { tasks } = useTasks();
  const [hintVisible, setHintVisible] = useState(readHintVisible);

  function dismissHint() {
    setHintVisible(false);
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      /* abaikan: petunjuk hanya muncul lagi di kunjungan berikutnya */
    }
  }

  // Urutkan dari tenggat paling dekat. Tugas selesai ditaruh di bawah.
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  // Prioritas: belum selesai dan sisa hari 3 atau kurang (termasuk yang terlambat).
  const priority = sorted.filter((t) => !t.done && daysLeft(t.dueDate) <= 3);
  // Belum mendesak: belum selesai dan tenggatnya masih lebih dari 3 hari.
  const others = sorted.filter((t) => !t.done && !priority.includes(t));
  // Tugas selesai punya bagian sendiri, supaya tidak ikut disebut "tenggat masih jauh".
  const finished = sorted.filter((t) => t.done);

  const summary =
    priority.length === 0
      ? 'Selamat mengerjakan.'
      : `${priority.length} tugas perlu segera dikerjakan.`;

  return (
    <>
      <section className="screen home">
        <header className="home-hero">
          <div className="greeting">
            <span className="avatar">
              <Icon name="user" />
            </span>
            <div>
              <h2>Halo, Atsalatsa</h2>
              <p className="greeting-sub">{summary}</p>
            </div>
          </div>

          {hintVisible && (
            <div className="hint-chip" role="note">
              <Icon name="info" size={20} />
              <p>
                Ketuk <strong>lingkaran</strong> untuk selesai, <strong>kartu</strong>{' '}
                untuk detail.
              </p>
              <button
                type="button"
                className="hint-close"
                aria-label="Tutup petunjuk"
                onClick={dismissHint}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          )}
        </header>

        <div className="home-body">
          <SectionHead
            title="Prioritas Mendekati Tenggat"
            sub="Kerjakan lebih dulu"
            count={priority.length}
          />
          {priority.length === 0 ? (
            <p className="caption">Belum ada tugas yang mendekati tenggat.</p>
          ) : (
            <ul className="task-list">
              {priority.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </ul>
          )}

          <SectionHead
            title="Daftar Tugas Lainnya"
            sub="Belum mendesak"
            count={others.length}
          />
          {others.length === 0 ? (
            <p className="caption">Belum ada tugas lain.</p>
          ) : (
            <ul className="task-list">
              {others.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </ul>
          )}

          {finished.length > 0 && (
            <>
              <SectionHead
                title="Sudah Selesai"
                sub="Sudah beres"
                count={finished.length}
              />
              <ul className="task-list">
                {finished.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Tombol tetap di bawah layar dan tidak ikut bergeser saat daftar di-scroll. */}
      <div className="action-bar">
        <Button to="/tambah" fullWidth>
          <Icon name="plus" /> Tambah Tugas
        </Button>
      </div>
    </>
  );
}
