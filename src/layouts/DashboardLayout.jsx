import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const titles = {
  '/dashboard': 'نظرة عامة',
  '/dashboard/create-group': 'إنشاء مجموعة',
  '/dashboard/groups': 'المجموعات',
}

function getTitle(pathname) {
  if (titles[pathname]) return titles[pathname]
  if (pathname.startsWith('/dashboard/groups/')) return 'تفاصيل المجموعة'
  return 'لوحة التحكم'
}

/**
 * Shared RTL dashboard shell: right-side sidebar + top header + page outlet.
 */
export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div dir="rtl" className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar (right side) */}
      <div className="hidden w-64 shrink-0 border-l border-slate-100 lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-64 shadow-xl lg:hidden"
              initial={{ x: 260 }}
              animate={{ x: 0 }}
              exit={{ x: 260 }}
              transition={{ duration: 0.2 }}
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={getTitle(location.pathname)} onMenuClick={() => setMobileOpen(true)} />
        <main className="scrollbar-thin flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
