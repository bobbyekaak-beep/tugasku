import { Link } from 'react-router-dom';
import type { Task } from '../types/task';
import { formatDate } from '../utils/deadline';
import { useTasks } from '../context/TaskContext';
import { DeadlineBadge } from './DeadlineBadge';
import { Icon } from './Icon';

export function TaskCard({ task }: { task: Task }) {
  const { toggleDone } = useTasks();

  return (
    <li className="task-card">
      <button
        type="button"
        className={`task-check ${task.done ? 'is-done' : ''}`}
        aria-label={
          task.done ? `Batalkan selesai: ${task.title}` : `Tandai selesai: ${task.title}`
        }
        onClick={() => toggleDone(task.id)}
      >
        <span>{task.done && <Icon name="check" size={18} />}</span>
      </button>

      <Link to={`/ubah/${task.id}`} className="task-link">
        <div className="task-main">
          <div className="task-top">
            <span className={`task-title ${task.done ? 'is-done' : ''}`}>
              {task.title}
              {task.done && <Icon name="check" size={16} />}
            </span>
            <DeadlineBadge dueDate={task.dueDate} done={task.done} />
          </div>
          <p className="caption">
            Tugas {task.type} · Sampai {formatDate(task.dueDate)}
          </p>
        </div>
        <Icon name="chevronRight" />
      </Link>
    </li>
  );
}
