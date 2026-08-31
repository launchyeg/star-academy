import { useEffect, useState } from "react";
import { Trash2, CalendarCheck } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

const PAYMENT_METHODS = ["كاش", "إنستا باي", "فودافون كاش"];
const SUBSCRIPTION_DAYS = 30;

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Card/modal for managing a single student's attendance/subscription records.
 * Supports adding a new monthly subscription (start date → auto end date +30 days,
 * plus payment method) and deleting an existing record. No edit functionality,
 * per product requirements — subscriptions are add/delete only.
 */
export default function AttendanceModal({
  open,
  onClose,
  student,
  onAdd,
  onDelete,
}) {
  const [startDate, setStartDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState("");
  const [deletingSubscription, setDeletingSubscription] = useState(null);

  useEffect(() => {
    if (open) {
      setStartDate("");
      setPaymentMethod(PAYMENT_METHODS[0]);
      setError("");
      setDeletingSubscription(null);
    }
  }, [open, student]);

  const endDate = startDate ? addDays(startDate, SUBSCRIPTION_DAYS) : "";

  function handleAdd(e) {
    e.preventDefault();

    if (!startDate) {
      setError("من فضلك اختر تاريخ البداية");
      return;
    }

    onAdd({ startDate, endDate, paymentMethod });
    setStartDate("");
    setPaymentMethod(PAYMENT_METHODS[0]);
    setError("");
  }

  if (!student) return null;

  const subscriptions = student.subscriptions || [];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`الحضور - ${student.name}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-6">
          <form
            onSubmit={handleAdd}
            className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
          >
            <h3 className="text-sm font-bold text-slate-700">
              إضافة اشتراك شهر جديد
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  تاريخ البداية
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={endDate}
                  disabled
                  readOnly
                  title="يتم حسابه تلقائيًا بعد 30 يومًا من تاريخ البداية"
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">
                طريقة الدفع
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                إضافة
              </button>
            </div>
          </form>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-700">
              سجل الاشتراكات
            </h3>

            {subscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-8 text-center">
                <CalendarCheck size={22} className="text-slate-300" />
                <p className="text-sm text-slate-400">
                  لا يوجد اشتراكات مسجلة بعد
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {subscriptions.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                      <span>
                        <span className="text-slate-400">تاريخ البداية: </span>
                        {sub.startDate}
                      </span>
                      <span>
                        <span className="text-slate-400">تاريخ الانتهاء: </span>
                        {sub.endDate}
                      </span>
                      <span>
                        <span className="text-slate-400">طريقة الدفع: </span>
                        {sub.paymentMethod}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeletingSubscription(sub)}
                      className="flex items-center gap-1 self-start rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 sm:self-auto"
                    >
                      <Trash2 size={14} />
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingSubscription)}
        onClose={() => setDeletingSubscription(null)}
        onConfirm={() => onDelete(deletingSubscription.id)}
        title="حذف الاشتراك"
        message="هل أنت متأكد من حذف هذا الاشتراك؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
}
