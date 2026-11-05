export type TaskType = 'individu' | 'kelompok';

export interface TaskFile {
  name: string;
  size: number;
}

export interface Task {
  id: string;
  title: string;
  course: string;
  type: TaskType;
  /** Tenggat dalam format YYYY-MM-DD */
  dueDate: string;
  notes: string;
  done: boolean;
  /** Catatan file yang dilampirkan (nama dan ukuran saja, belum ada server). */
  files: TaskFile[];
}

export type ActivityKind = 'done' | 'undone' | 'added' | 'updated' | 'deleted' | 'upload';

export interface Activity {
  id: string;
  kind: ActivityKind;
  text: string;
  /** Waktu kejadian, format ISO */
  at: string;
}

export interface Profile {
  displayName: string;
  fullName: string;
  nim: string;
  email: string;
  campus: string;
}

export interface Settings {
  /** Animasi cahaya background bergerak. */
  motion: boolean;
  /** Lonceng menampilkan pengingat tugas mendesak. */
  reminders: boolean;
}
