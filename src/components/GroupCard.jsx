import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users2, ChevronLeft } from 'lucide-react'

/**
 * Clickable card representing a single group, used on the Groups grid.
 */
export default function GroupCard({ group }) {
  const navigate = useNavigate()

  return (
    <motion.button
      type="button"
      onClick={() => navigate(`/dashboard/groups/${group.id}`)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-right shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Users2 size={20} />
        </div>
        <ChevronLeft size={18} className="mt-2 text-slate-300" />
      </div>

      <div className="w-full">
        <h3 className="line-clamp-2 text-base font-bold text-slate-800">{group.name}</h3>
        <p className="mt-2 text-sm text-slate-400">
          عدد الطلاب: <span className="font-semibold text-slate-600">{group.students.length}</span>
        </p>
      </div>
    </motion.button>
  )
}
