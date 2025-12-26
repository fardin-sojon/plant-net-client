import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const useRole = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure()

  // Get email from user object or fallback to providerData for Google login
  const userEmail = user?.email || user?.providerData?.[0]?.email

  const { data: role = '', isLoading } = useQuery({
    queryKey: ['role', userEmail],
    enabled: !loading && !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/users/${userEmail}`)
      return data.role
    },
  })

  return [role, isLoading]
}

export default useRole
