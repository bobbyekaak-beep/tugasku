import { getDeadlineStatus } from '../utils/deadline';
import { Icon, type IconName } from './Icon';

interface Props {
  dueDate: string;
  done: boolean;
}

// Pembeda tambahan di luar warna (style guide bagian 4).
const ICON: Partial<Record<string, IconName>> = {
  late: 'alert',
  urgent: 'clock',
  done: 'check',
};

/** Badge selalu memuat teks, jadi status tidak hanya dibedakan lewat warna. */
export function DeadlineBadge({ dueDate, done }: Props) {
  const { label, tone } = getDeadlineStatus(dueDate, done);
  const icon = ICON[tone];

  return (
    <span className={`badge badge-${tone}`}>
      {icon && <Icon name={icon} size={16} />}
      {label}
    </span>
  );
}
