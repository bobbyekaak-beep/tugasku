export type TaskType = 'individu' | 'kelompok';

export interface Task {
  id: string;
  title: string;
  course: string;
  type: TaskType;
  /** Tenggat dalam format YYYY-MM-DD */
  dueDate: string;
  notes: string;
  done: boolean;
}

/** Isian yang dikirim saat menambah atau mengubah tugas. */
export type TaskInput = Omit<Task, 'id' | 'done'>;
