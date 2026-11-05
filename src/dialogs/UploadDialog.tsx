import { useRef, useState, type DragEvent } from 'react';
import { Button } from '../components/Button';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { useTasks } from '../context/TaskContext';
import { useUI } from '../context/UIContext';

interface Props {
  taskId?: string;
  onClose: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadDialog({ taskId, onClose }: Props) {
  const { tasks, addFiles } = useTasks();
  const { toast } = useUI();
  const pending = tasks.filter((t) => !t.done);
  const selectable =
    taskId && !pending.some((t) => t.id === taskId)
      ? [...tasks.filter((t) => t.id === taskId), ...pending]
      : pending;

  const [target, setTarget] = useState(taskId ?? selectable[0]?.id ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);

  function pick(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
    setError('');
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files);
  }

  function submit() {
    if (!target) return setError('Pilih tugas tujuan terlebih dahulu');
    if (files.length === 0) return setError('Pilih minimal satu file');
    addFiles(
      target,
      files.map((f) => ({ name: f.name, size: f.size })),
    );
    toast(
      files.length === 1
        ? 'File berhasil diupload'
        : `${files.length} file berhasil diupload`,
    );
    onClose();
  }

  return (
    <Dialog
      title="Upload File Tugas"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={submit}>
            <Icon name="upload" size={18} /> Upload
          </Button>
        </>
      }
    >
      <div className="form">
        <div className="field">
          <div className="field-head">
            <label htmlFor="upload-task">Untuk tugas</label>
            <span className="caption">Wajib</span>
          </div>
          <div className="select-wrap">
            <select
              id="upload-task"
              className="input"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              {selectable.length === 0 && <option value="">Belum ada tugas</option>}
              {selectable.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" />
          </div>
        </div>

        <div
          className={`dropzone ${dragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <Icon name="upload" size={32} />
          <p>
            Tarik file ke sini atau{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => input.current?.click()}
            >
              pilih dari perangkat
            </button>
          </p>
          <input
            ref={input}
            type="file"
            multiple
            hidden
            aria-label="Pilih file"
            onChange={(e) => {
              pick(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <Icon name="file" size={18} />
                <span className="file-name">{f.name}</span>
                <span className="caption">{formatSize(f.size)}</span>
                <button
                  type="button"
                  className="icon-btn icon-btn-sm"
                  aria-label={`Hapus ${f.name} dari daftar`}
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Icon name="close" size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="caption">
          Versi ini belum memakai server, jadi yang tersimpan adalah catatan nama dan
          ukuran file.
        </p>
        {error && (
          <p className="error" role="alert">
            <Icon name="alertCircle" size={16} /> {error}
          </p>
        )}
      </div>
    </Dialog>
  );
}
