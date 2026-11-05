import { Button } from '../components/Button';
import { Dialog } from '../components/Dialog';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  options,
  onClose,
}: {
  options: ConfirmOptions;
  onClose: () => void;
}) {
  return (
    <Dialog
      title={options.title}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant={options.danger ? 'danger' : 'primary'}
            onClick={() => {
              options.onConfirm();
              onClose();
            }}
          >
            {options.confirmLabel}
          </Button>
        </>
      }
    >
      <p className="confirm-text">{options.message}</p>
    </Dialog>
  );
}
