import React from 'react';
import { Button } from './Button';

export type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string; // e.g., 'sm:max-w-lg'
};

export function Modal({ open, title, onClose, children, footer, widthClass = 'sm:max-w-lg' }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      {/* Panel */}
      <div className={`relative w-full ${widthClass} rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden`}
        style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer ? (
          <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Modal;