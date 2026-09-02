import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AcademyProvider } from './context/AcademyContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import DashboardOverview from './pages/DashboardOverview'
import CreateGroup from './pages/CreateGroup'
import Groups from './pages/Groups'
import GroupDetails from './pages/GroupDetails'
import DataCenter from './pages/DataCenter'
import { siteConfig } from './siteConfig'

export default function App() {
  // index.html's <title> is static markup read before React mounts, so it
  // can't pull from siteConfig directly — set it here once on load instead,
  // keeping the tab title in sync with everything else siteConfig drives.
  useEffect(() => {
    document.title = siteConfig.siteName
  }, [])

  return (
    <AuthProvider>
      <AcademyProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="create-group" element={<CreateGroup />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:id" element={<GroupDetails />} />
            <Route path="data-center" element={<DataCenter />} />
          </Route>
        </Routes>
      </AcademyProvider>
    </AuthProvider>
  )
}
