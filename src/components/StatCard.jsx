import { motion } from 'framer-motion'

/**
 * A single statistic tile used on the Overview page.
 */
export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  const accentClasses = {
    primary: 'bg-primary-50 text-primary-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </motion.div>
  )
}
