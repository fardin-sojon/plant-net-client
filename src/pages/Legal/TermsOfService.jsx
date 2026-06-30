import React from 'react'
import Container from '../../components/Shared/Container'


const TermsOfService = () => {
  return (
    <div className='min-h-screen py-16 bg-base-100'>

      <Container>
        <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 border-b pb-4 dark:border-gray-700'>Terms of Service</h1>
          
          <div className='prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300'>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>1. Acceptance of Terms</h2>
              <p>By accessing and using PlantNet, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>2. User Accounts</h2>
              <p>If you create an account on the Website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>3. Product Availability</h2>
              <p>All products are subject to availability. We reserve the right to limit the quantity of products we supply, supply only part of an order or to divide up orders. We also reserve the right to alter the terms or duration of any special offers or sale promotion.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>4. Modifications to Service</h2>
              <p>PlantNet reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time. You agree that PlantNet shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default TermsOfService
