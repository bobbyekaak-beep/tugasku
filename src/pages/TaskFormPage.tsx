import { useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { Icon } from '../components/Icon';
import { formatDateLong, toDateString } from '../utils/deadline';
import type { TaskType } from '../types/task';
import { NotFoundPage } from './NotFoundPage';

const COURSES = [
  'Basis Data Lanjut',
  'Finance Technology',
  'Bahasa Indonesia',
  'Agama',
  'Front End',
];

/** Satu layar dipakai untuk Tambah Tugas dan Ubah Tugas. */
export function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTasks();
  const editing = tasks.find((t) => t.id === id);
  const isEdit = Boolean(editing);

  const [title, setTitle] = useState(editing?.title ?? '');
  const [course, setCourse] = useState(editing?.course ?? '');
  const [type, setType] = useState<TaskType>(editing?.type ?? 'individu');
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? toDateString(new Date()));
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});
  const dateInput = useRef<HTMLInputElement>(null);

  // Alamat /ubah/ dengan id yang tidak ada diperlakukan sebagai halaman tidak ditemukan.
  if (id && !editing) return <NotFoundPage />;

  const courseOptions =
    course && !COURSES.includes(course) ? [course, ...COURSES] : COURSES;

  function openDatePicker() {
    try {
      dateInput.current?.showPicker();
    } catch {
      // Browser lama: kolom tetap bisa diisi lewat fokus biasa.
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
    if (editing) updateTask(editing.id, data);
    else addTask(data);
    navigate('/');
  }

  return (
    <>
      <section className="screen form-screen">
        <div className="screen-title">
          <button
            type="button"
            className="back-btn"
            aria-label="Kembali"
            onClick={() => navigate(-1)}
          >
            <Icon name="arrowLeft" />
          </button>
          <h2>{isEdit ? 'Ubah Tugas' : 'Tambah Tugas'}</h2>
        </div>

        <form id="task-form" className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <div className="field-head">
              <label htmlFor="title">Nama tugas</label>
              <span className="caption">Wajib</span>
            </div>
            <input
              id="title"
              className={`input ${errors.title ? 'has-error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Laporan Praktikum"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="error">
                <Icon name="alertCircle" size={16} /> {errors.title}
              </p>
            )}
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="course">Mata kuliah</label>
              <span className="caption">Opsional</span>
            </div>
            <div className="select-wrap">
              <select
                id="course"
                className="input"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="">Pilih mata kuliah</option>
                {courseOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" />
            </div>
          </div>

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
                      {type === value && <Icon name="check" size={20} />}
                      {value === 'individu' ? 'Individu' : 'Kelompok'}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="dueDate">Tanggal tenggat</label>
              <span className="caption">Wajib</span>
            </div>
            <div
              className={`input date-field ${errors.dueDate ? 'has-error' : ''}`}
              onClick={openDatePicker}
            >
              <span>{dueDate ? formatDateLong(dueDate) : 'Pilih tanggal'}</span>
              <Icon name="calendar" />
              <input
                ref={dateInput}
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-invalid={Boolean(errors.dueDate)}
              />
            </div>
            {errors.dueDate && (
              <p className="error">
                <Icon name="alertCircle" size={16} /> {errors.dueDate}
              </p>
            )}
            {dueDate && !errors.dueDate && (
              <p className="hint caption">
                Tampil di Beranda sebagai <DeadlineBadge dueDate={dueDate} done={false} />
              </p>
            )}
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="notes">Catatan</label>
              <span className="caption">Opsional</span>
            </div>
            <textarea
              id="notes"
              className="input"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: dikumpulkan lewat e-belajar"
            />
          </div>
        </form>
      </section>

      {/* Tombol simpan tetap di bawah layar meskipun form di-scroll. */}
      <div className="action-bar">
        <button type="submit" form="task-form" className="btn btn-full">
          <Icon name="check" /> {isEdit ? 'Simpan Perubahan' : 'Simpan Tugas'}
        </button>
      </div>
    </>
  );
}
