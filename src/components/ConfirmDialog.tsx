import { useEffect, useRef, type ReactNode } from 'react'

type ConfirmDialogProps = {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  /** While the action runs: buttons disabled. */
  pending?: boolean
  /** The action's error, shown in the dialog. */
  error?: string | null
  onConfirm: () => void
  /** Cancel button, Escape key, or the dialog closing for any other reason. */
  onCancel: () => void
}

// A confirmation built on the browser's <dialog>: showModal() makes it modal (the page behind is
// inert), moves focus into it, closes on Escape, and gives focus back to the button that opened it.
function ConfirmDialog({ open, title, children, confirmLabel, pending = false, error, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // `open` is React's state; showModal()/close() are the DOM's. This effect keeps them in sync.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby="confirm-dialog-title" onClose={onCancel}>
      <h2 id="confirm-dialog-title">{title}</h2>
      <div className="confirm-dialog-body">{children}</div>
      {error && <p className="error-message confirm-dialog-error" role="alert">{error}</p>}
      <div className="confirm-dialog-actions">
        <button className="add-button" type="button" onClick={onCancel} disabled={pending}>Annuler</button>
        <button className="add-button is-danger" type="button" onClick={onConfirm} disabled={pending}>
          {pending ? 'Patientez…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
