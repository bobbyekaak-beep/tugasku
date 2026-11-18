/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import * as api from '../api/taskApi';
import type { Task, TaskInput } from '../types/task';

type Status = 'loading' | 'ready' | 'error';

interface TaskContextValue {
  tasks: Task[];
  status: Status;
  /** Pesan gagal dari aksi cepat (misalnya menandai selesai). null bila tidak ada. */
  actionError: string | null;
  dismissActionError: () => void;
  reload: () => void;
  addTask: (task: TaskInput) => Promise<Task>;
  updateTask: (id: string, changes: TaskInput) => Promise<Task>;
  toggleDone: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchTasks = useCallback(() => {
    api
      .listTasks()
      .then((list) => {
        setTasks(list);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const reload = () => {
    setStatus('loading');
    fetchTasks();
  };

  const addTask: TaskContextValue['addTask'] = async (input) => {
    const created = await api.createTask(input);
    setTasks((prev) => [...prev, created]);
    return created;
  };

  const updateTask: TaskContextValue['updateTask'] = async (id, changes) => {
    const saved = await api.updateTask(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
    return saved;
  };

  const toggleDone: TaskContextValue['toggleDone'] = async (id) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    try {
      const saved = await api.updateTask(id, { done: !current.done });
      setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
    } catch {
      setActionError('Status tugas gagal disimpan. Coba lagi.');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        status,
        actionError,
        dismissActionError: () => setActionError(null),
        reload,
        addTask,
        updateTask,
        toggleDone,
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
