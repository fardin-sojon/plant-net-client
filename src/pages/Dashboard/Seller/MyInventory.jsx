import PlantDataRow from '../../../components/Dashboard/TableRows/PlantDataRow'
import InventoryCard from '../../../components/Dashboard/Cards/InventoryCard'
import toast from 'react-hot-toast'
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';


const MyInventory = () => {

   const {user} = useAuth()
   const axiosSecure = useAxiosSecure()

  const {
    data: plants = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['plants', user?.email || user?.providerData[0]?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/my-inventory/${user?.email || user?.providerData[0]?.email}`)
      return data
    },
  });

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/plants/${id}`);
      refetch();
      toast.success("Delete Successful");
    } catch (err) {
      // console.log(err);
      toast.error(err.message);
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
                      Delete
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant) => (
                    <PlantDataRow
                      key={plant._id}
                      plant={plant}
                      handleDelete={handleDelete}
                      refetch={refetch}
                    />
                  ))}
                </tbody>
              </table>
               {/* Mobile View: Cards */}
              <div className='md:hidden flex flex-col gap-4 p-4 bg-gray-50'>
                  {plants.map((plant) => (
                      <InventoryCard
                        key={plant._id}
                        plant={plant}
                         handleDelete={handleDelete}
                         refetch={refetch}
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

export default MyInventory
