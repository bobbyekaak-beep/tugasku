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
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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

export function formatDate(value: string): string {
  const date = parseDate(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Contoh: Sen, 5 Okt 2026 */
export function formatDateLong(value: string): string {
  return `${DAYS[parseDate(value).getDay()]}, ${formatDate(value)}`;
}

/** Contoh: 2 Nov 2026 • 14.30 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} • ${hh}.${mm}`;
}

/**
 * Aturan badge (mengikuti mockup):
 * terlambat, mendesak (hari ini/besok), N hari lagi (2-6 hari),
 * lalu satuan minggu dan bulan untuk tenggat yang lebih jauh.
 */
export function getDeadlineStatus(
  dueDate: string,
  done: boolean,
  today: Date = new Date(),
): DeadlineStatus {
  if (done) return { label: 'Selesai', tone: 'done' };

  const days = daysLeft(dueDate, today);
  if (days < 0) return { label: 'Terlambat', tone: 'late' };
  if (days <= 1) return { label: 'Mendesak!', tone: 'urgent' };
  if (days <= 6) return { label: `${days} hari lagi`, tone: 'soon' };
  if (days < 30) return { label: `${Math.floor(days / 7)} minggu lagi`, tone: 'normal' };
  return { label: `${Math.floor(days / 30)} bulan lagi`, tone: 'normal' };
}
