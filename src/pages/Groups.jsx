import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Users2 } from "lucide-react";
import { useAcademy } from "../context/AcademyContext";
import GroupCard from "../components/GroupCard";
import EditGroupModal from "../components/EditGroupModal";
import ConfirmDialog from "../components/ConfirmDialog";

/**
 * Grid of all groups. Clicking a card navigates to /dashboard/groups/:id;
 * each card also exposes edit (rename) and delete actions.
 */
export default function Groups() {
  const { groups, updateGroup, deleteGroup } = useAcademy();
  const [editingGroup, setEditingGroup] = useState(null);
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groups;
    return groups.filter((group) => group.name?.toLowerCase().includes(query));
  }, [groups, searchQuery]);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-300">
          <Users2 size={26} />
        </div>
        <div>
          <p className="font-medium text-slate-600">لا توجد مجموعات بعد</p>
          <p className="mt-1 text-sm text-slate-400">
            ابدأ بإنشاء أول مجموعة في الأكاديمية
          </p>
        </div>
        <Link
          to="/dashboard/create-group"
          className="mt-2 flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          <PlusCircle size={17} />
          إنشاء مجموعة
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          إجمالي المجموعات: {groups.length}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-56">
            <Search
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المجموعة..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <Link
            to="/dashboard/create-group"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <PlusCircle size={16} />
            مجموعة جديدة
          </Link>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <Users2 size={24} />
          </div>
          <p className="text-sm text-slate-400">لا توجد مجموعات مطابقة لبحثك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={setEditingGroup}
              onDelete={setDeletingGroup}
            />
          ))}
        </div>
      )}

      <EditGroupModal
        open={Boolean(editingGroup)}
        onClose={() => setEditingGroup(null)}
        onSubmit={(name) => updateGroup(editingGroup.id, name)}
        group={editingGroup}
      />

      <ConfirmDialog
        open={Boolean(deletingGroup)}
        onClose={() => setDeletingGroup(null)}
        onConfirm={() => deleteGroup(deletingGroup.id)}
        title="حذف المجموعة"
        message={`هل أنت متأكد من حذف مجموعة "${deletingGroup?.name}"؟ سيتم حذف المجموعة فقط — الطلاب واشتراكاتهم يبقون محفوظين، وسيصبحون غير مرتبطين بأي مجموعة.`}
      />
    </div>
  );
}
