import useAuth from '../hooks/useAuth'
import useRole from '../hooks/useRole'
import { Navigate, useLocation } from 'react-router'
import LoadingSpinner from '../components/Shared/LoadingSpinner'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const [role, roleLoading] = useRole()
  const location = useLocation()

  if (loading || roleLoading) return <LoadingSpinner />
  if (user && role === 'admin') return children
  
  // Redirect to dashboard if not admin
  return <Navigate to='/dashboard' replace='true' />
}

export default AdminRoute
