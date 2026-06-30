import React from 'react'
import Container from '../../components/Shared/Container'


const ReturnPolicy = () => {
  return (
    <div className='min-h-screen py-16 bg-base-100'>

      <Container>
        <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 border-b pb-4 dark:border-gray-700'>Return Policy</h1>
          
          <div className='prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300'>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>1. Return Window</h2>
              <p>We offer a 14-day return window for all non-plant merchandise. Due to the perishable nature of plants, live plants cannot be returned unless they arrived damaged or dead. If your plant arrives in poor condition, please contact us within 48 hours of delivery.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>2. Condition of Returned Items</h2>
              <p>To be eligible for a return on non-plant items, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>3. Refunds Process</h2>
              <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>4. Shipping Costs for Returns</h2>
              <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ReturnPolicy
