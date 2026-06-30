import React from 'react'
import FAQ from '../../components/Home/FAQ'


const FaqPage = () => {
  return (
    <div className='min-h-screen bg-base-100'>

      {/* Page Header */}
      <div className='bg-lime-50 dark:bg-gray-800 py-16 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4'>Frequently Asked Questions</h1>
        <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
          Find answers to common questions about our plants, shipping, and care guides.
        </p>
      </div>
      <div className='py-8'>
        <FAQ />
      </div>
    </div>
  )
}

export default FaqPage
