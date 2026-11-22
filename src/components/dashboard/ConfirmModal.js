// fixmath/src/components/dashboard/ConfirmModal.js
'use client';

import { LoaderCircle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({
  open,
  title,
  text,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} title={title} onClose={onClose} width={440}>
      <p className="confirm-text">{text}</p>
      <div className="confirm-actions">
        <button
          className="btn btn-outline"
          onClick={onClose}
          disabled={loading}
        >
          Keep it
        </button>
        <button
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <LoaderCircle size={16} className="spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
