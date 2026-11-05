import { getDeadlineStatus } from '../utils/deadline';
import { Icon, type IconName } from './Icon';

interface Props {
  dueDate: string;
  done: boolean;
}

// Ikon pembeda di luar warna: status tidak hanya dibedakan lewat warna.
const ICON: Record<string, IconName> = {
  late: 'alert',
  urgent: 'heart',
  soon: 'sparkle',
  normal: 'sparkle',
  done: 'check',
};

export function DeadlineBadge({ dueDate, done }: Props) {
  const { label, tone } = getDeadlineStatus(dueDate, done);
  return (
    <span className={`badge badge-${tone}`}>
      <Icon name={ICON[tone]} size={tone === 'done' || tone === 'late' ? 14 : 12} />
      {label}
    </span>
  );
}
