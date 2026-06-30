import React from 'react'
import Container from '../../components/Shared/Container'

import toast from 'react-hot-toast'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'
import axios from 'axios'

const ContactUs = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const email = form.email.value
    const subject = form.subject.value
    const message = form.message.value

    const loadingToast = toast.loading('Sending your message...')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact-messages`, {
        name,
        email,
        subject,
        message
      })
      toast.dismiss(loadingToast)
      toast.success('Your message has been sent successfully!')
      form.reset()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.response?.data?.message || error.message || 'Failed to send message')
    }
  }

  return (
    <div className='min-h-screen py-16 bg-base-100'>

      <Container>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>Get In Touch</h1>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Have questions about your plants, an order, or just want to say hello? We'd love to hear from you.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            {/* Contact Info */}
            <div className='space-y-8'>
              <div className='bg-lime-50 dark:bg-gray-800 p-8 rounded-lg space-y-6'>
                <h3 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6'>Contact Information</h3>
                
                <div className='flex items-start gap-4'>
                  <div className='p-3 bg-lime-100 dark:bg-lime-900/30 text-lime-600 rounded-full'>
                    <FaMapMarkerAlt className='text-xl' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-800 dark:text-white'>Address</h4>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>Berpara, Haripur, Kashiyadanga,<br/>Paba, Rajshahi</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='p-3 bg-lime-100 dark:bg-lime-900/30 text-lime-600 rounded-full'>
                    <FaPhoneAlt className='text-xl' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-800 dark:text-white'>Phone</h4>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>01650230536</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='p-3 bg-lime-100 dark:bg-lime-900/30 text-lime-600 rounded-full'>
                    <FaEnvelope className='text-xl' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-800 dark:text-white'>Email</h4>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>fardinsojon@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
              <h3 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6'>Send us a Message</h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Name</label>
                  <input type='text' name='name' required className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' placeholder='Your Name' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Email</label>
                  <input type='email' name='email' required className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' placeholder='Your Email' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Subject</label>
                  <input type='text' name='subject' required className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' placeholder='How can we help?' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Message</label>
                  <textarea name='message' required rows='4' className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' placeholder='Write your message here...'></textarea>
                </div>
                <button type='submit' className='w-full py-3 px-4 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-md transition duration-200'>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ContactUs
