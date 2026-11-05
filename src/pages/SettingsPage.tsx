import { Button } from '../components/Button';
import { Switch } from '../components/Switch';
import { useApp } from '../context/AppContext';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const { resetSample, clearAll } = useTasks();
  const { confirm, toast } = useUI();

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Pengaturan</h1>
          <p className="page-sub">Atur tampilan dan data aplikasi.</p>
        </div>
      </div>

      <section className="glass card settings-card">
        <h2 className="h-small">Tampilan</h2>
        <div className="setting-row">
          <div>
            <p className="setting-title">Animasi cahaya background</p>
            <p className="caption">
              Cahaya biru dan ungu bergerak pelan. Matikan agar lebih hemat baterai.
            </p>
          </div>
          <Switch
            label="Animasi cahaya background"
            checked={settings.motion}
            onChange={(motion) => updateSettings({ motion })}
          />
        </div>
        <div className="setting-row">
          <div>
            <p className="setting-title">Pengingat tenggat</p>
            <p className="caption">
              Lonceng menandai tugas yang terlambat atau jatuh tempo hari ini dan besok.
            </p>
          </div>
          <Switch
            label="Pengingat tenggat"
            checked={settings.reminders}
            onChange={(reminders) => updateSettings({ reminders })}
          />
        </div>
      </section>

      <section className="glass card settings-card">
        <h2 className="h-small">Data</h2>
        <div className="setting-row">
          <div>
            <p className="setting-title">Kembalikan data contoh</p>
            <p className="caption">
              Mengganti semua tugas dengan 20 tugas contoh seperti di mockup.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              confirm({
                title: 'Kembalikan data contoh?',
                message:
                  'Semua tugas dan aktivitas saat ini akan diganti dengan data contoh.',
                confirmLabel: 'Kembalikan',
                onConfirm: () => {
                  resetSample();
                  toast('Data contoh dikembalikan');
                },
              })
            }
          >
            Kembalikan
          </Button>
        </div>
        <div className="setting-row">
          <div>
            <p className="setting-title">Hapus semua tugas</p>
            <p className="caption">
              Mengosongkan daftar tugas dan aktivitas. Tidak bisa dibatalkan.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={() =>
              confirm({
                title: 'Hapus semua tugas?',
                message:
                  'Semua tugas dan aktivitas akan dihapus permanen dari perangkat ini.',
                confirmLabel: 'Hapus Semua',
                danger: true,
                onConfirm: () => {
                  clearAll();
                  toast('Semua tugas dihapus');
                },
              })
            }
          >
            Hapus Semua
          </Button>
        </div>
      </section>
    </div>
  );
}
