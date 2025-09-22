import React from 'react'

export type DialogProps = {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  widthClass?: string // e.g., 'sm:max-w-lg'
  children: React.ReactNode
  footer?: React.ReactNode
  tone?: 'default' | 'danger' | 'success' | 'warning'
}

// New Dialog design: Centered, elevated, with sticky header/footer and subtle scale-in
export function Dialog({
  open,
  title,
  description,
  onClose,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  widthClass = 'sm:max-w-xl',
  children,
  footer,
  tone = 'default',
}: DialogProps) {
  if (!open) return null

  const toneStyles: Record<NonNullable<DialogProps['tone']>, { header: string; submit: string; submitWeak: string }> = {
    default: {
      header: 'var(--color-primary-weak)',
      submit: 'var(--color-primary)',
      submitWeak: 'var(--color-primary-weak)',
    },
    danger: {
      header: 'var(--color-danger-weak)',
      submit: 'var(--color-danger)',
      submitWeak: 'var(--color-danger-weak)',
    },
    success: {
      header: 'var(--color-success-weak)',
      submit: 'var(--color-success)',
      submitWeak: 'var(--color-success-weak)',
    },
    warning: {
      header: 'var(--color-warning-weak)',
      submit: 'var(--color-warning)',
      submitWeak: 'var(--color-warning-weak)',
    },
  }

  const t = toneStyles[tone]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />

      {/* Panel */}
      <div
        className={`relative w-full ${widthClass} max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-[fadeIn_150ms_ease-out]`}
        style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 flex items-start gap-3" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: t.header }}>
            <span className="text-lg">💬</span>
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 id="dialog-title" className="text-lg font-semibold truncate" style={{ color: 'var(--color-foreground)' }}>
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:opacity-80"
            aria-label="Close"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-auto max-h-[65vh]">{children}</div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 flex items-center justify-end gap-2" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          {footer ? (
            footer
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground)', background: 'transparent' }}
              >
                {cancelLabel}
              </button>
              {onSubmit && (
                <button
                  onClick={onSubmit}
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ background: t.submit, color: 'var(--color-primary-foreground)' }}
                >
                  {submitLabel}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dialog