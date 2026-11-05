/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ActivitiesDialog } from '../dialogs/ActivitiesDialog';
import { ConfirmDialog, type ConfirmOptions } from '../dialogs/ConfirmDialog';
import { TaskFormDialog } from '../dialogs/TaskFormDialog';
import { UploadDialog } from '../dialogs/UploadDialog';
import { Icon } from '../components/Icon';

interface UIContextValue {
  openTaskForm: (opts?: { taskId?: string; date?: string }) => void;
  openUpload: (taskId?: string) => void;
  openActivities: () => void;
  confirm: (options: ConfirmOptions) => void;
  toast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

interface Toast {
  id: number;
  message: string;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [taskForm, setTaskForm] = useState<{ taskId?: string; date?: string } | null>(
    null,
  );
  const [upload, setUpload] = useState<{ taskId?: string } | null>(null);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const value: UIContextValue = {
    openTaskForm: (opts) => setTaskForm(opts ?? {}),
    openUpload: (taskId) => setUpload({ taskId }),
    openActivities: () => setActivitiesOpen(true),
    confirm: setConfirmOptions,
    toast,
  };

  return (
    <UIContext.Provider value={value}>
      {children}

      {taskForm && (
        <TaskFormDialog
          key={`${taskForm.taskId ?? 'baru'}-${taskForm.date ?? ''}`}
          taskId={taskForm.taskId}
          date={taskForm.date}
          onClose={() => setTaskForm(null)}
        />
      )}
      {upload && <UploadDialog taskId={upload.taskId} onClose={() => setUpload(null)} />}
      {activitiesOpen && <ActivitiesDialog onClose={() => setActivitiesOpen(false)} />}
      {confirmOptions && (
        <ConfirmDialog options={confirmOptions} onClose={() => setConfirmOptions(null)} />
      )}

      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name="check" size={18} /> {t.message}
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI harus dipakai di dalam UIProvider');
  return context;
}
