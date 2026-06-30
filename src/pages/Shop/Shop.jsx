import React from 'react'
import Plants from '../../components/Home/Plants'
import Container from '../../components/Shared/Container'


const Shop = () => {
  return (
    <div className='min-h-screen pt-12 bg-base-100'>

      <Container>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>Our Collection</h1>
          <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Browse our wide selection of indoor and outdoor plants. From easy-care succulents to lush tropical foliage, find the perfect green companion for your space.
          </p>
        </div>
      </Container>
      <Plants />
    </div>
  )
}

export default Shop
