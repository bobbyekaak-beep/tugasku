/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Task } from '../types/task';
import { toDateString } from '../utils/deadline';

type TaskInput = Omit<Task, 'id' | 'done'>;

interface TaskContextValue {
  tasks: Task[];
  addTask: (task: TaskInput) => void;
  updateTask: (id: string, changes: TaskInput) => void;
  toggleDone: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

/** Tanggal contoh dibuat relatif terhadap hari ini supaya badge selalu terlihat sama. */
function dayFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDateString(date);
}

function createSampleTasks(): Task[] {
  return [
    {
      id: '1',
      title: 'Basis Data Lanjut',
      course: 'Basis Data Lanjut',
      type: 'kelompok',
      dueDate: dayFromNow(1),
      notes: '',
      done: false,
    },
    {
      id: '2',
      title: 'Finance Technology',
      course: 'Finance Technology',
      type: 'individu',
      dueDate: dayFromNow(3),
      notes: '',
      done: false,
    },
    {
      id: '3',
      title: 'Bahasa Indonesia',
      course: 'Bahasa Indonesia',
      type: 'individu',
      dueDate: dayFromNow(6),
      notes: '',
      done: false,
    },
    {
      id: '4',
      title: 'Agama',
      course: 'Agama',
      type: 'individu',
      dueDate: dayFromNow(12),
      notes: '',
      done: false,
    },
    {
      id: '5',
      title: 'Front End',
      course: 'Front End',
      type: 'kelompok',
      dueDate: dayFromNow(-1),
      notes: '',
      done: true,
    },
  ];
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(createSampleTasks);

  const addTask: TaskContextValue['addTask'] = (task) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID(), done: false }]);
  };

  const updateTask: TaskContextValue['updateTask'] = (id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  };

  const toggleDone: TaskContextValue['toggleDone'] = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, toggleDone }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks harus dipakai di dalam TaskProvider');
  return context;
}
