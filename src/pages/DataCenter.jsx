import { useMemo } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, UserRound } from "lucide-react";
import { useAcademy } from "../context/AcademyContext";

/**
 * Read-only view of every student across every group in one table, with a
 * one-click Excel export. No edit/delete/actions here on purpose — this page
 * is a data overview only.
 */
export default function DataCenter() {
  const { groups } = useAcademy();

  const allStudents = useMemo(
    () => groups.flatMap((group) => group.students),
    [groups],
  );

  function handleExport() {
    const rows = allStudents.map((student) => ({
      "رقم هاتف ولي الأمر": student.parentPhone,
      "رقم هاتف الطالب": student.phone,
      "اسم الطالب": student.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب");
    XLSX.writeFile(workbook, "بيانات الطلاب.xlsx");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          إجمالي الطلاب: {allStudents.length}
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={allStudents.length === 0}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileSpreadsheet size={16} />
          تصدير ملف إكسل
        </button>
      </div>

      {allStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <UserRound size={24} />
          </div>
          <p className="text-sm text-slate-400">لا يوجد طلاب بعد</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full min-w-[520px] text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-sm text-slate-500">
                  <th className="px-5 py-3 font-medium">اسم الطالب</th>
                  <th className="px-5 py-3 font-medium">رقم هاتف الطالب</th>
                  <th className="px-5 py-3 font-medium">رقم هاتف ولي الأمر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="text-sm text-slate-700 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5 font-medium">{student.name}</td>
                    <td className="px-5 py-3.5 text-slate-500" dir="ltr">
                      {student.phone}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500" dir="ltr">
                      {student.parentPhone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
