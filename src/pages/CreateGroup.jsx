import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useAcademy } from "../context/AcademyContext";

/**
 * Form to create a new group. The group is added to React state
 * and the admin is redirected straight to its details page.
 */
export default function CreateGroup() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { addGroup } = useAcademy();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("من فضلك أدخل اسم المجموعة");
      return;
    }

    try {
      const newGroup = await addGroup(name);
      navigate(`/dashboard/groups/${newGroup.id}`);
    } catch {
      setError("حدث خطأ أثناء إنشاء المجموعة، حاول مرة أخرى");
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">إنشاء مجموعة</h2>
            <p className="text-sm text-slate-400">
              أضف مجموعة جديدة إلى الأكاديمية
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:w-auto sm:px-8"
          >
            إنشاء المجموعة
          </button>
        </form>
      </div>
    </div>
  );
}
