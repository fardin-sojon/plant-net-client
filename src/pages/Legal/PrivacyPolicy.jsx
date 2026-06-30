import React from 'react'
import Container from '../../components/Shared/Container'


const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen py-16 bg-base-100'>

      <Container>
        <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 border-b pb-4 dark:border-gray-700'>Privacy Policy</h1>
          
          <div className='prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300'>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you create an account, make a purchase, or contact us for support. This may include your name, email address, postal address, phone number, and payment information.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Process your transactions and send related information.</li>
                <li>Send you technical notices, updates, and support messages.</li>
                <li>Respond to your comments, questions, and customer service requests.</li>
                <li>Communicate with you about products, services, offers, and events offered by PlantNet.</li>
              </ul>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>3. Information Sharing</h2>
              <p>We do not share your personal information with third parties except as described in this privacy policy or as required by law. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
            </section>

            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>4. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@plantnet.com.</p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default PrivacyPolicy
