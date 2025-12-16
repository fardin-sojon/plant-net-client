import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import UpdatePlantForm from '../Form/UpdatePlantForm'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { imageUpload } from '../../utils'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const UpdatePlantModal = ({ setIsEditModalOpen, isOpen, plant, refetch }) => {
  const [loading, setLoading] = useState(false)
  const axiosSecure = useAxiosSecure()

  const handleSubmit = async e => {
    setLoading(true)
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const category = form.category.value
    const price = form.price.value
    const quantity = form.quantity.value
    const description = form.description.value
    const image = form.image.files[0]
    let imageUrl = plant.image

    if (image) {
      imageUrl = await imageUpload(image)
    }

    // update plant data
    const plantData = {
      name,
      category,
      price,
      quantity,
      description,
      image: imageUrl,
      seller: {
        email: plant?.seller?.email,
        name: plant?.seller?.name,
        image: plant?.seller?.image,
      },
    }

    try {
      // post request
      await axiosSecure.patch(
        `/plants/${plant?._id}`,
        plantData
      )
      toast.success('Data Updated Successfully!')
      refetch()
      setIsEditModalOpen(false)
      setLoading(false)
    } catch (err) {
      // console.log(err)
      setLoading(false)
      toast.error(err.message)
    }
  }
  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-10 focus:outline-none '
      onClose={() => setIsEditModalOpen(false)}
    >
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl'
          >
            <div className='flex justify-end'>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className='bg-red-100 px-3 py-1 rounded-md text-red-500 cursor-pointer'
              >
                X
              </button>
            </div>
            <DialogTitle
              as='h3'
              className='text-lg font-medium text-center leading-6 text-gray-900'
            >
              Update Plant Info
            </DialogTitle>
            <div className='mt-2 w-full'>
              <UpdatePlantForm
                handleSubmit={handleSubmit}
                plantData={plant}
                loading={loading}
              />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default UpdatePlantModal
