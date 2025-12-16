import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast'
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import SellerOrderDataRow from "../../../components/Dashboard/TableRows/SellerOrderDataRow";
import SellerOrderCard from "../../../components/Dashboard/Cards/SellerOrderCard";
import useAuth from '../../../hooks/useAuth'
import useRole from '../../../hooks/useRole'

const ManageOrders = () => {

  const {user} = useAuth()
  const [role] = useRole()
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders", user?.email || user?.providerData[0]?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(
        role === 'admin' 
          ? `/admin-orders` 
          : `/manage-orders/${user?.email || user?.providerData[0]?.email}`
      );
      return data;
    },
    enabled: !!user && !!role, // Wait for user and role to be ready
  });

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

  const handleStatusChange = async (id, status) => {
    // Optimistic Update: Update UI immediately
    queryClient.setQueryData(["orders", user?.email || user?.providerData[0]?.email], (oldOrders) => {
      return oldOrders.map(order => order._id === id ? { ...order, status } : order)
    })

    try {
        await axiosSecure.patch(`/orders/status/${id}`, { status })
        toast.success("Status Updated")
    } catch (err) {
        // console.log(err)
        toast.error(err.response.data.message)
        // Revert on error (optional but good practice, keeping simple for now or refetch)
        refetch()
    }
  }


  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal hidden md:table">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders.map(order => (
                      <SellerOrderDataRow
                        key={order._id}
                        order={order}
                        handleDelete={handleDelete}
                        handleStatusChange={handleStatusChange}
                      />
                    ))
                  }
                </tbody>
              </table>

              {/* Mobile View: Cards */}
              <div className='md:hidden flex flex-col gap-4 p-4 bg-gray-50'>
                  {orders.map(order => (
                      <SellerOrderCard
                        key={order._id}
                        order={order}
                        handleDelete={handleDelete}
                        handleStatusChange={handleStatusChange}
                      />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageOrders;
