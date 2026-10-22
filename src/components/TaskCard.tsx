import { Link } from 'react-router-dom';
import type { Task } from '../types/task';
import { formatDate, getDeadlineStatus } from '../utils/deadline';
import { useTasks } from '../context/TaskContext';
import { Card } from './Card';
import { DeadlineBadge } from './DeadlineBadge';
import { Icon } from './Icon';

export function TaskCard({ task }: { task: Task }) {
  const { toggleDone } = useTasks();
  const { tone } = getDeadlineStatus(task.dueDate, task.done);

  return (
    <Card as="li" className={`task-card tone-${tone}`}>
      {/* Lingkaran = tandai selesai. Kartu (panah) = buka detail. */}
      <button
        type="button"
        className={`task-check ${task.done ? 'is-done' : ''}`}
        aria-label={
          task.done ? `Batalkan selesai: ${task.title}` : `Tandai selesai: ${task.title}`
        }
        onClick={() => toggleDone(task.id)}
      >
        <span>
          <Icon name="check" size={18} />
        </span>
      </button>

      <Link to={`/ubah/${task.id}`} className="task-link">
        <div className="task-main">
          <p className="task-type">Tugas {task.type}</p>
          <span className={`task-title ${task.done ? 'is-done' : ''}`}>{task.title}</span>
          <p className="task-meta">
            <DeadlineBadge dueDate={task.dueDate} done={task.done} />
            <span className="task-date">
              <Icon name="calendar" size={16} />
              <span className="sr-only">Sampai </span>
              {formatDate(task.dueDate)}
            </span>
          </p>
        </div>
        <Icon name="chevronRight" />
      </Link>
    </Card>
  );
}
