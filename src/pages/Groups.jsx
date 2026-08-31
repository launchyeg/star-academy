import { Link } from 'react-router-dom'
import { PlusCircle, Users2 } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext'
import GroupCard from '../components/GroupCard'

/**
 * Grid of all groups. Clicking a card navigates to /dashboard/groups/:id
 */
export default function Groups() {
  const { groups } = useAcademy()

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-300">
          <Users2 size={26} />
        </div>
        <div>
          <p className="font-medium text-slate-600">لا توجد مجموعات بعد</p>
          <p className="mt-1 text-sm text-slate-400">ابدأ بإنشاء أول مجموعة في الأكاديمية</p>
        </div>
        <Link
          to="/dashboard/create-group"
          className="mt-2 flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          <PlusCircle size={17} />
          إنشاء مجموعة
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">إجمالي المجموعات: {groups.length}</p>
        <Link
          to="/dashboard/create-group"
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <PlusCircle size={16} />
          مجموعة جديدة
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}
