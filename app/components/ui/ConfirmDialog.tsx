import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      {message ? <p style={{ color: 'var(--color-foreground)' }}>{message}</p> : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>{cancelText}</Button>
        <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;