import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import useAuth from './useAuth'
import { getAuth } from 'firebase/auth'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Request interceptor to dynamically get latest Firebase ID token on every call
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      } catch (err) {
        console.error('Error getting Firebase token:', err)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const useAxiosSecure = () => {
  const { logOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Response interceptor to handle auth failures (401/403)
    const responseInterceptor = axiosInstance.interceptors.response.use(
      res => res,
      err => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logOut()
            .then(() => {
              // Logged out successfully
            })
            .catch(console.error)
          navigate('/login')
        }
        return Promise.reject(err)
      }
    )

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [logOut, navigate])

  return axiosInstance
}

export default useAxiosSecure
