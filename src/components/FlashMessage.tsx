import { Icon } from './Icon';

interface Props {
  message: string;
  tone?: 'success' | 'error';
  onClose: () => void;
}

/** Pesan singkat di atas layar: hijau bila berhasil, merah bila gagal. Selalu memuat teks dan ikon. */
export function FlashMessage({ message, tone = 'success', onClose }: Props) {
  return (
    <div className={`flash flash-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'error' ? 'alert' : 'check'} size={20} />
      <p>{message}</p>
      <button
        type="button"
        className="flash-close"
        aria-label="Tutup pesan"
        onClick={onClose}
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}
