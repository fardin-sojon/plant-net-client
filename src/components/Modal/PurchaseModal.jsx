import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useAuth from '../../hooks/useAuth'
import axios from "axios";

const PurchaseModal = ({ closeModal, isOpen, plant }) => {
  const {user} = useAuth()
  const {_id, name, category, quantity, price, description, image, seller } = plant

  // Total Price Calculation

  const handlePayment = async()=>{
    try {
      // Format data to match backend API structure
      const paymentData = {
        items: [{
          _id: _id,
          plantId: _id,
          name, 
          category, 
          price, 
          description,
          quantity: 1,
          image,
          seller
        }],
        customer: {
          name: user?.displayName,
          email: user?.email || user?.providerData?.[0]?.email,
          image: user?.photoURL,
        }
      }
      
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/create-checkout-session`, paymentData)
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed: ' + (error.response?.data?.message || error.message || 'Unknown error'))
    }
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md bg-white dark:bg-gray-800 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl"
          >
            <DialogTitle
              as="h3"
              className="text-lg font-medium text-center leading-6 text-gray-900 dark:text-white"
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Plant: {name}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Category: {category}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Customer: {user?.displayName}</p>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300">Price: ${price}</p>
            </div>
            <div className="mt-2">
              {/* <p className="text-sm text-gray-500">
                Available Quantity: {quantity}
              </p> */}
            </div>
            <div className="flex mt-2 justify-around">
              <button
              onClick={handlePayment}
                type="button"
                className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Pay
              </button>
              <button
                type="button"
                className="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
