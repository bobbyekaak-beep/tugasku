import { ActivityList } from '../components/ActivityList';
import { Dialog } from '../components/Dialog';
import { useTasks } from '../context/TaskContext';

export function ActivitiesDialog({ onClose }: { onClose: () => void }) {
  const { activities } = useTasks();
  return (
    <Dialog title="Semua Aktivitas" onClose={onClose}>
      <ActivityList items={activities} />
    </Dialog>
  );
}
