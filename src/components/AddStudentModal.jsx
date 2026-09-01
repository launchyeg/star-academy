import { useEffect, useState } from "react";
import Modal from "./Modal";

const emptyForm = { name: "", phone: "", parentPhone: "", price: "" };

/**
 * Modal form used to both add a new student and edit an existing one.
 * Pass `initialData` to pre-fill the form in edit mode.
 */
export default function AddStudentModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const isEditMode = Boolean(initialData);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name,
              phone: initialData.phone,
              parentPhone: initialData.parentPhone,
              price: initialData.price,
            }
          : emptyForm,
      );
      setError("");
    }
  }, [open, initialData]);

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.parentPhone.trim() ||
      form.price === ""
    ) {
      setError("من فضلك أدخل جميع البيانات المطلوبة");
      return;
    }

    if (Number(form.price) < 0) {
      setError("سعر الاشتراك غير صحيح");
      return;
    }

    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      parentPhone: form.parentPhone.trim(),
      price: Number(form.price),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? "تعديل بيانات الطالب" : "إضافة طالب"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            اسم الطالب
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="مثال: محمد أحمد"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            رقم هاتف الطالب
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="01xxxxxxxxx"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            رقم هاتف ولي الأمر
          </label>
          <input
            type="tel"
            value={form.parentPhone}
            onChange={handleChange("parentPhone")}
            placeholder="01xxxxxxxxx"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-600">
            سعر الاشتراك
          </label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange("price")}
            placeholder="0"
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
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            {isEditMode ? "حفظ التعديلات" : "إضافة الطالب"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
