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

export default function App() {
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
          </Route>
        </Routes>
      </AcademyProvider>
    </AuthProvider>
  )
}
