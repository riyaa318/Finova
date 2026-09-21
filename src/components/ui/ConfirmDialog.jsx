import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

/** Confirmation step for destructive actions. `onConfirm` may be async; errors are shown inline. */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', tone = 'danger', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    if (busy) return;
    setError('');
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      setBusy(false);
      onClose();
    } catch (err) {
      setBusy(false);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={busy} data-autofocus>
            Cancel
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={busy} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p data-stagger className="text-body text-muted">
        {message}
      </p>
      {error && (
        <p role="alert" className="mt-3 rounded-control bg-danger/10 px-3 py-2 text-small font-medium text-danger">
          {error}
        </p>
      )}
    </Modal>
  );
}
