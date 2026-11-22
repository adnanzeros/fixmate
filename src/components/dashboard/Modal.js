// fixmath/src/components/dashboard/Modal.js
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  width = 520,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
