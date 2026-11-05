import type { Activity, ActivityKind } from '../types/task';
import { formatDateTime } from '../utils/deadline';
import { Icon, type IconName } from './Icon';

const KIND: Record<ActivityKind, { icon: IconName; tone: string }> = {
  done: { icon: 'check', tone: 'green' },
  undone: { icon: 'clock', tone: 'amber' },
  added: { icon: 'plus', tone: 'blue' },
  updated: { icon: 'edit', tone: 'blue' },
  deleted: { icon: 'trash', tone: 'red' },
  upload: { icon: 'file', tone: 'purple' },
};

export function ActivityList({ items }: { items: Activity[] }) {
  if (items.length === 0) return <p className="caption empty">Belum ada aktivitas.</p>;
  return (
    <ul className="activity-list">
      {items.map((a) => (
        <li key={a.id}>
          <span className={`activity-icon tone-${KIND[a.kind].tone}`}>
            <Icon name={KIND[a.kind].icon} size={16} />
          </span>
          <div>
            <p className="activity-text">{a.text}</p>
            <p className="activity-time">{formatDateTime(a.at)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
