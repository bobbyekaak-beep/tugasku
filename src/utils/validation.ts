export const TITLE_MAX = 80;

export interface TaskErrors {
  title?: string;
  dueDate?: string;
}

/** Aturan isian tugas. Dipakai form di front-end dan nanti dipakai ulang oleh server. */
export function validateTask(input: { title: string; dueDate: string }): TaskErrors {
  const errors: TaskErrors = {};
  const title = input.title.trim();
  if (!title) errors.title = 'Nama tugas wajib diisi';
  else if (title.length > TITLE_MAX) {
    errors.title = `Nama tugas maksimal ${TITLE_MAX} karakter`;
  }
  if (!input.dueDate) errors.dueDate = 'Tanggal tenggat wajib diisi';
  return errors;
}
