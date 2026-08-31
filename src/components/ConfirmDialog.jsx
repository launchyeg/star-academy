import Modal from './Modal'

/**
 * Reusable confirmation dialog, used before destructive actions (e.g. delete student).
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'تأكيد الحذف',
  message = 'هل أنت متأكد من رغبتك في المتابعة؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmLabel = 'حذف',
  cancelLabel = 'إلغاء',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-6 text-slate-500">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
