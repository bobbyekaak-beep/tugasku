import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../components/Button';
import { Dialog } from '../components/Dialog';
import { FormField } from '../components/FormField';
import { Icon } from '../components/Icon';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';
import { COURSES } from '../data/courses';
import type { TaskType } from '../types/task';
import { formatDateLong, toDateString } from '../utils/deadline';

interface Props {
  taskId?: string;
  date?: string;
  onClose: () => void;
}

/** Satu dialog dipakai untuk Tambah Tugas dan Ubah Tugas. */
export function TaskFormDialog({ taskId, date, onClose }: Props) {
  const { tasks, addTask, updateTask } = useTasks();
  const { toast } = useUI();
  const editing = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState(editing?.title ?? '');
  const [course, setCourse] = useState(editing?.course ?? '');
  const [type, setType] = useState<TaskType>(editing?.type ?? 'individu');
  const [dueDate, setDueDate] = useState(
    editing?.dueDate ?? date ?? toDateString(new Date()),
  );
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});
  const dateInput = useRef<HTMLInputElement>(null);

  const courseOptions =
    course && !COURSES.includes(course) ? [course, ...COURSES] : COURSES;

  function openDatePicker() {
    try {
      dateInput.current?.showPicker();
    } catch {
      /* browser lama: kolom tetap bisa diisi lewat fokus biasa */
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'Nama tugas wajib diisi';
    if (!dueDate) next.dueDate = 'Tanggal tenggat wajib diisi';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const data = { title: title.trim(), course, type, dueDate, notes: notes.trim() };
    if (editing) {
      updateTask(editing.id, data);
      toast('Perubahan tugas disimpan');
    } else {
      addTask(data);
      toast('Tugas baru ditambahkan');
    }
    onClose();
  }

  return (
    <Dialog
      title={editing ? 'Ubah Tugas' : 'Tambah Tugas'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="task-form">
            <Icon name="check" size={18} />{' '}
            {editing ? 'Simpan Perubahan' : 'Simpan Tugas'}
          </Button>
        </>
      }
    >
      <form id="task-form" className="form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="title"
          label="Nama tugas"
          requirement="wajib"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Laporan Praktikum"
          error={errors.title}
        />

        <FormField
          control="select"
          id="course"
          label="Mata kuliah"
          requirement="opsional"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Pilih mata kuliah"
          options={courseOptions.map((c) => ({ value: c, label: c }))}
        />

        <div className="field">
          <fieldset>
            <div className="field-head">
              <legend>Jenis tugas</legend>
              <span className="caption">Opsional</span>
            </div>
            <div className="segmented">
              {(['individu', 'kelompok'] as TaskType[]).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={type === value}
                    onChange={() => setType(value)}
                  />
                  <span>
                    {type === value && <Icon name="check" size={18} />}
                    {value === 'individu' ? 'Individu' : 'Kelompok'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <FormField
          control="custom"
          id="dueDate"
          label="Tanggal tenggat"
          requirement="wajib"
          error={errors.dueDate}
          helper={
            dueDate ? (
              <>
                Tampil sebagai <DeadlineBadge dueDate={dueDate} done={false} />
              </>
            ) : undefined
          }
        >
          <div
            className={`input date-field ${errors.dueDate ? 'has-error' : ''}`}
            onClick={openDatePicker}
          >
            <span>{dueDate ? formatDateLong(dueDate) : 'Pilih tanggal'}</span>
            <Icon name="calendar" size={20} />
            <input
              ref={dateInput}
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-invalid={Boolean(errors.dueDate)}
            />
          </div>
        </FormField>

        <FormField
          control="textarea"
          id="notes"
          label="Catatan"
          requirement="opsional"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Contoh: dikumpulkan lewat e-belajar"
        />
      </form>
    </Dialog>
  );
}
