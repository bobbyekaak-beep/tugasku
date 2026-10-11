export type BadgeTone = 'late' | 'urgent' | 'soon' | 'normal' | 'done';

export interface DeadlineStatus {
  label: string;
  tone: BadgeTone;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/** Ubah string YYYY-MM-DD menjadi tanggal lokal (tanpa jam). */
export function parseDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toDateString(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Selisih hari kalender dari hari ini, berapa pun jamnya. */
export function daysLeft(dueDate: string, today: Date = new Date()): number {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = parseDate(dueDate).getTime() - start.getTime();
  return Math.round(diff / 86_400_000);
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

/** Contoh: Sen, 5 Okt 2026 (dipakai di kolom tanggal form). */
export function formatDateLong(value: string): string {
  const date = parseDate(value);
  return `${DAYS[date.getDay()]}, ${formatDate(value)}`;
}

export function formatDate(value: string): string {
  const date = parseDate(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Aturan badge mengikuti bagian 4 style guide. */
export function getDeadlineStatus(
  dueDate: string,
  done: boolean,
  today: Date = new Date(),
): DeadlineStatus {
  if (done) return { label: 'Selesai', tone: 'done' };

  const days = daysLeft(dueDate, today);
  if (days < 0) return { label: 'Terlambat', tone: 'late' };
  if (days === 0) return { label: 'Hari ini', tone: 'urgent' };
  if (days === 1) return { label: 'Besok', tone: 'urgent' };
  if (days <= 3) return { label: `${days} hari`, tone: 'urgent' };
  if (days <= 7) return { label: `${days} hari`, tone: 'soon' };
  if (days <= 30) return { label: `${days} hari`, tone: 'normal' };
  return { label: '30+ hari', tone: 'normal' };
}
