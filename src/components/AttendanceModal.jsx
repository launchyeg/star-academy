import { useEffect, useState } from "react";
import { Trash2, CalendarCheck } from "lucide-react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import { buildReceiptWhatsAppLink } from "../utils/whatsapp";

const PAYMENT_METHODS = ["كاش", "إنستا باي", "فودافون كاش"];
const SUBSCRIPTION_DAYS = 30;

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function WhatsAppIcon({ size = 14 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.17.01.4-.07.63.48.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
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
  groupName,
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

  function handleSendReceipt(sub) {
    const link = buildReceiptWhatsAppLink({
      studentName: student.name,
      groupName,
      price: student.price,
      startDate: sub.startDate,
      endDate: sub.endDate,
      paymentMethod: sub.paymentMethod,
      parentPhone: student.parentPhone,
    });
    window.open(link, "_blank", "noopener,noreferrer");
  }

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
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleSendReceipt(sub)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50"
                      >
                        <WhatsAppIcon size={14} />
                        ايصال
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingSubscription(sub)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
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
