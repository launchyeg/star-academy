import { useEffect, useState } from "react";
import Modal from "./Modal";

/**
 * Modal form used to rename an existing group from the Groups page.
 */
export default function EditGroupModal({ open, onClose, onSubmit, group }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(group?.name || "");
      setError("");
      setSubmitting(false);
    }
  }, [open, group]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("من فضلك أدخل اسم المجموعة");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(name);
      onClose();
    } catch {
      setError("حدث خطأ أثناء حفظ التعديلات، حاول مرة أخرى");
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="تعديل اسم المجموعة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            اسم المجموعة
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: مجموعة اللغة الإنجليزية - المستوى الأول"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
