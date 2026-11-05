/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import type { Activity, ActivityKind, Task, TaskFile } from '../types/task';
import { toDateString } from '../utils/deadline';
import { usePersistentState } from '../utils/storage';

export type TaskInput = Omit<Task, 'id' | 'done' | 'files'>;

interface TaskContextValue {
  tasks: Task[];
  activities: Activity[];
  addTask: (task: TaskInput) => void;
  updateTask: (id: string, changes: TaskInput) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
  addFiles: (id: string, files: TaskFile[]) => void;
  removeFile: (id: string, fileName: string) => void;
  resetSample: () => void;
  clearAll: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

function dayFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDateString(date);
}

const PENDING: Array<[string, string, 'individu' | 'kelompok', number, string]> = [
  [
    'Basis Data Lanjut',
    'Basis Data Lanjut',
    'kelompok',
    0,
    'Kerjakan materi dan latihan soal',
  ],
  ['Finance Technology', 'Finance Technology', 'individu', 2, 'Buat laporan akhir'],
  [
    'Desain UI/UX Aplikasi',
    'Desain UI/UX Aplikasi',
    'kelompok',
    7,
    'Revisi tampilan aplikasi',
  ],
  [
    'Jaringan Komputer',
    'Jaringan Komputer',
    'individu',
    15,
    'Laporan praktikum konfigurasi jaringan',
  ],
  ['Struktur Data', 'Struktur Data', 'individu', 21, 'Latihan soal tree dan graph'],
];

const DONE: Array<[string, string]> = [
  ['Pengembangan Web', 'Pengembangan Web'],
  ['Front End', 'Front End'],
  ['Bahasa Indonesia', 'Bahasa Indonesia'],
  ['Agama', 'Agama'],
  ['Algoritma Pemrograman', 'Struktur Data'],
  ['Basis Data Dasar', 'Basis Data Lanjut'],
  ['Pengantar Teknologi Informasi', 'Jaringan Komputer'],
  ['Matematika Diskrit', 'Struktur Data'],
  ['Bahasa Inggris', 'Bahasa Indonesia'],
  ['Pancasila', 'Agama'],
  ['Desain Antarmuka Dasar', 'Desain UI/UX Aplikasi'],
  ['Sistem Operasi', 'Jaringan Komputer'],
  ['Statistika', 'Struktur Data'],
  ['Etika Profesi', 'Agama'],
  ['Kewirausahaan Digital', 'Finance Technology'],
];

/** Data contoh: 20 tugas, 15 selesai (75%), tanggal dibuat relatif terhadap hari ini. */
function createSampleTasks(): Task[] {
  const pending = PENDING.map(([title, course, type, offset, notes], i): Task => ({
    id: `p${i + 1}`,
    title,
    course,
    type,
    dueDate: dayFromNow(offset),
    notes,
    done: false,
    files: [],
  }));
  const done = DONE.map(([title, course], i): Task => ({
    id: `d${i + 1}`,
    title,
    course,
    type: i % 3 === 0 ? 'kelompok' : 'individu',
    dueDate: dayFromNow(-(i + 2)),
    notes: '',
    done: true,
    files: [],
  }));
  return [...pending, ...done];
}

function createSampleActivities(): Activity[] {
  return [
    {
      id: 'a1',
      kind: 'done',
      text: 'Tugas “Pengembangan Web” ditandai selesai',
      at: '2026-11-02T14:30:00',
    },
    {
      id: 'a2',
      kind: 'added',
      text: 'Tugas baru “Basis Data Lanjut” ditambahkan',
      at: '2026-11-02T10:15:00',
    },
    {
      id: 'a3',
      kind: 'upload',
      text: 'File tugas diupload: laporan.pdf',
      at: '2026-11-01T20:45:00',
    },
  ];
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = usePersistentState<Task[]>(
    'tugasku:v2:tasks',
    createSampleTasks,
  );
  const [activities, setActivities] = usePersistentState<Activity[]>(
    'tugasku:v2:activities',
    createSampleActivities,
  );

  function log(kind: ActivityKind, text: string) {
    const entry: Activity = {
      id: crypto.randomUUID(),
      kind,
      text,
      at: new Date().toISOString(),
    };
    setActivities((prev) => [entry, ...prev].slice(0, 50));
  }

  const addTask: TaskContextValue['addTask'] = (input) => {
    setTasks((prev) => [
      ...prev,
      { ...input, id: crypto.randomUUID(), done: false, files: [] },
    ]);
    log('added', `Tugas baru “${input.title}” ditambahkan`);
  };

  const updateTask: TaskContextValue['updateTask'] = (id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    log('updated', `Tugas “${changes.title}” diperbarui`);
  };

  const deleteTask: TaskContextValue['deleteTask'] = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) log('deleted', `Tugas “${task.title}” dihapus`);
  };

  const toggleDone: TaskContextValue['toggleDone'] = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    log(
      task.done ? 'undone' : 'done',
      task.done
        ? `Tugas “${task.title}” dibuka kembali`
        : `Tugas “${task.title}” ditandai selesai`,
    );
  };

  const addFiles: TaskContextValue['addFiles'] = (id, files) => {
    if (files.length === 0) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, files: [...t.files, ...files] } : t)),
    );
    log('upload', `File tugas diupload: ${files.map((f) => f.name).join(', ')}`);
  };

  const removeFile: TaskContextValue['removeFile'] = (id, fileName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, files: t.files.filter((f) => f.name !== fileName) } : t,
      ),
    );
  };

  const resetSample = () => {
    setTasks(createSampleTasks());
    setActivities(createSampleActivities());
  };

  const clearAll = () => {
    setTasks([]);
    setActivities([]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activities,
        addTask,
        updateTask,
        deleteTask,
        toggleDone,
        addFiles,
        removeFile,
        resetSample,
        clearAll,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks harus dipakai di dalam TaskProvider');
  return context;
}
