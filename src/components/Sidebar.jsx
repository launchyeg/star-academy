import { NavLink } from 'react-router-dom'
import { LayoutGrid, PlusCircle, Users2, Star } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'نظرة عامة', icon: LayoutGrid, end: true },
  { to: '/dashboard/create-group', label: 'إنشاء مجموعة', icon: PlusCircle },
  { to: '/dashboard/groups', label: 'المجموعات', icon: Users2 },
]

/**
 * Right-side navigation sidebar for the dashboard (RTL layout).
 */
export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
          <Star size={20} fill="currentColor" strokeWidth={0} />
        </div>
        <div>
          <p className="text-base font-bold text-slate-800">Star Academy</p>
          <p className="text-xs text-slate-400">لوحة التحكم</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={19}
                  className={isActive ? 'text-primary-600' : 'text-slate-400'}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-6 py-4">
        <p className="text-xs text-slate-300">Star Academy © 2026</p>
      </div>
    </aside>
  )
}
