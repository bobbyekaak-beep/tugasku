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
