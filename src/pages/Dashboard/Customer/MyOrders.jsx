import { useQuery } from '@tanstack/react-query';
import CustomerOrderDataRow from '../../../components/Dashboard/TableRows/CustomerOrderDataRow'
import CustomerOrderCard from '../../../components/Dashboard/Cards/CustomerOrderCard'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

const MyOrders = () => {

  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.email || user?.providerData[0]?.email],
    queryFn: async () => {
      
      const { data } = await axiosSecure(`/my-orders/${user?.email || user?.providerData[0]?.email}`)
      return data;
    },
  });

  // console.log(orders);
  
  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/orders/${id}`);
      refetch();
      toast.success("Order canceled successfully");
    } catch (err) {
      // console.log(err);
      toast.error(err.response.data.message);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal hidden md:table'>
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Image
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Category
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Price
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Quantity
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Status
                    </th>

                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <CustomerOrderDataRow
                      key={order._id}
                      order={order}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>

              {/* Mobile View: Cards */}
              <div className='md:hidden flex flex-col gap-4 p-4 bg-gray-50'>
                  {orders.map(order => (
                      <CustomerOrderCard
                        key={order._id}
                        order={order}
                        handleDelete={handleDelete}
                      />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyOrders
