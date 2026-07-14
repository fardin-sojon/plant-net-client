import AdminStatistics from '../../../components/Dashboard/Statistics/AdminStatistics'
import SellerStatistics from '../../../components/Dashboard/Statistics/SellerStatistics'
import CustomerStatistics from '../../../components/Dashboard/Statistics/CustomerStatistics'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'

const Statistics = () => {
  const [role, isLoading] = useRole()

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {role === 'admin' && <AdminStatistics />}
      {role === 'seller' && <SellerStatistics />}
      {role === 'customer' && <CustomerStatistics />}
    </div>
  )
}

export default Statistics
