import type { Task } from '../types/task';
import { daysLeft, toDateString } from './deadline';

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/** Minggu dimulai hari Senin, seperti mockup. */
export const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

/** 42 sel (6 minggu) untuk satu bulan, dimulai dari hari Senin. */
export function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Senin = 0
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}

export type DotTone = 'urgent' | 'soon' | 'normal';

/** Warna titik penanda pada tanggal. Hanya tugas yang belum selesai. */
export function dotTone(tasks: Task[], today: Date = new Date()): DotTone | null {
  const pending = tasks.filter((t) => !t.done);
  if (pending.length === 0) return null;
  const nearest = Math.min(...pending.map((t) => daysLeft(t.dueDate, today)));
  if (nearest <= 1) return 'urgent';
  if (nearest <= 7) return 'soon';
  return 'normal';
}

/** Kelompokkan tugas per tanggal (YYYY-MM-DD). */
export function groupByDate(tasks: Task[]): Map<string, Task[]> {
  const map = new Map<string, Task[]>();
  for (const t of tasks) {
    const list = map.get(t.dueDate) ?? [];
    list.push(t);
    map.set(t.dueDate, list);
  }
  return map;
}

export { toDateString };
