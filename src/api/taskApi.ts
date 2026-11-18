import type { Task, TaskInput } from '../types/task';
import { toDateString } from '../utils/deadline';
import { validateTask, type TaskErrors } from '../utils/validation';

/**
 * Lapisan data TugasKu. Sprint 1 memakai localStorage sebagai pengganti server.
 * Bentuk fungsi dan datanya sama dengan kontrak REST di dokumen arsitektur
 * (GET/POST/PATCH /api/tasks), jadi nanti cukup isi fungsi ini diganti fetch.
 */
export const STORAGE_KEY = 'tugasku.tasks.v1';

type ErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'STORAGE_ERROR';

export class TaskApiError extends Error {
  code: ErrorCode;
  fields?: TaskErrors;

  constructor(code: ErrorCode, message: string, fields?: TaskErrors) {
    super(message);
    this.code = code;
    this.fields = fields;
  }
}

function dayFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDateString(date);
}

/** Tanggal contoh dibuat relatif terhadap hari pertama aplikasi dibuka. */
function createSampleTasks(): Task[] {
  const base = { notes: '' };
  return [
    {
      ...base,
      id: '1',
      title: 'Basis Data Lanjut',
      course: 'Basis Data Lanjut',
      type: 'kelompok',
      dueDate: dayFromNow(1),
      done: false,
    },
    {
      ...base,
      id: '2',
      title: 'Finance Technology',
      course: 'Finance Technology',
      type: 'individu',
      dueDate: dayFromNow(3),
      done: false,
    },
    {
      ...base,
      id: '3',
      title: 'Bahasa Indonesia',
      course: 'Bahasa Indonesia',
      type: 'individu',
      dueDate: dayFromNow(6),
      done: false,
    },
    {
      ...base,
      id: '4',
      title: 'Agama',
      course: 'Agama',
      type: 'individu',
      dueDate: dayFromNow(12),
      done: false,
    },
    {
      ...base,
      id: '5',
      title: 'Front End',
      course: 'Front End',
      type: 'kelompok',
      dueDate: dayFromNow(-1),
      done: true,
    },
  ];
}

/** crypto.randomUUID hanya ada di HTTPS atau localhost, jadi diberi cadangan untuk uji lewat jaringan lokal. */
function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Mengembalikan null bila belum ada data atau isinya rusak. */
function readSaved(): Task[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as Task[]) : null;
  } catch {
    return null;
  }
}

function writeAll(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    throw new TaskApiError('STORAGE_ERROR', 'Penyimpanan penuh atau tidak tersedia');
  }
}

/** GET /api/tasks */
export async function listTasks(): Promise<Task[]> {
  const saved = readSaved();
  if (saved) return saved;
  const sample = createSampleTasks();
  try {
    writeAll(sample);
  } catch {
    // Penyimpanan tidak tersedia: data contoh tetap ditampilkan untuk sesi ini.
  }
  return sample;
}

/** POST /api/tasks */
export async function createTask(input: TaskInput): Promise<Task> {
  const fields = validateTask(input);
  if (Object.keys(fields).length > 0) {
    throw new TaskApiError('VALIDATION_ERROR', 'Isian tugas belum benar', fields);
  }
  const tasks = await listTasks();
  const task: Task = {
    ...input,
    title: input.title.trim(),
    notes: input.notes.trim(),
    id: newId(),
    done: false,
  };
  writeAll([...tasks, task]);
  return task;
}

/** PATCH /api/tasks/:id */
export async function updateTask(
  id: string,
  changes: Partial<TaskInput & { done: boolean }>,
): Promise<Task> {
  const tasks = await listTasks();
  const current = tasks.find((t) => t.id === id);
  if (!current) throw new TaskApiError('NOT_FOUND', 'Tugas tidak ditemukan');

  const merged: Task = { ...current, ...changes };
  const fields = validateTask(merged);
  if (Object.keys(fields).length > 0) {
    throw new TaskApiError('VALIDATION_ERROR', 'Isian tugas belum benar', fields);
  }
  merged.title = merged.title.trim();
  merged.notes = merged.notes.trim();
  writeAll(tasks.map((t) => (t.id === id ? merged : t)));
  return merged;
}
