import React from 'react'
import Container from '../../components/Shared/Container'
import { FaLeaf, FaUsers, FaHeart, FaShieldAlt } from 'react-icons/fa'
import aboutImg from '../../assets/images/about_us.jpg'

const AboutUs = () => {
  const values = [
    {
      icon: <FaLeaf className='text-3xl text-lime-500' />,
      title: 'Premium Quality',
      description: 'We source and deliver only the healthiest and most vibrant plant species, handpicked by experts.'
    },
    {
      icon: <FaUsers className='text-3xl text-lime-500' />,
      title: 'Empowering Local Sellers',
      description: 'We provide a robust marketplace platform for local nurseries and independent plant growers.'
    },
    {
      icon: <FaHeart className='text-3xl text-lime-500' />,
      title: 'Customer First',
      description: 'Your growth is our happiness. We offer post-purchase plant care guidelines and support.'
    },
    {
      icon: <FaShieldAlt className='text-3xl text-lime-500' />,
      title: 'Sustainability',
      description: 'We promote organic gardening products and eco-friendly packing solutions to protect mother nature.'
    }
  ]

  const team = [
    {
      name: 'MD FARDIN RAHMAN SOJON',
      role: 'Founder & CEO',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocIZ-5P4Gnd2-0GS6MVxbOKDZM0CWPmexlgf_jiv2XF4Ewn7OIvo=s200-c',
      bio: 'Visionary plant enthusiast dedicated to making urban green spaces accessible to everyone in Bangladesh.'
    }
  ]

  return (
    <div className='min-h-screen bg-base-100 dark:bg-gray-900 transition-colors duration-300'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br from-lime-50 to-emerald-100/50 dark:from-gray-800 dark:to-gray-900 py-20 text-center transition-colors duration-300 overflow-hidden'>
        <div className='absolute inset-0 bg-grid-pattern opacity-10'></div>
        <Container>
          <div className='relative z-10 max-w-3xl mx-auto'>
            <span className='px-4 py-1.5 bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 rounded-full font-bold text-xs uppercase tracking-wider'>
              Our Journey
            </span>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-white mt-4 mb-6 leading-tight'>
              Growing Green, <span className='text-lime-500'>Living Better</span>
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
              PlantNet is more than a marketplace. We are a community of plant lovers, horticulturists, and local growers working together to bring nature closer to your life.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Story Section */}
        <div className='py-20 flex flex-col lg:flex-row items-center gap-16'>
          <div className='w-full lg:w-1/2 relative'>
            <div className='relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800 transition-transform duration-300 hover:scale-[1.02]'>
              <img
                src={aboutImg}
                alt="PlantNet Story"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className='absolute -bottom-8 -right-8 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl -z-10'></div>
          </div>

          <div className='w-full lg:w-1/2 space-y-6'>
            <h2 className='text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white leading-tight'>
              Our Story & Inspiration
            </h2>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              Founded in 2025, PlantNet was born out of a simple dream: to transform urban spaces into thriving green sanctuaries. We noticed that local plant growers and nurseries had beautiful plant collections but struggled to reach buyers in other cities. At the same time, city dwellers wanted healthy plants but lacked access or reliable advice.
            </p>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              We created a bridge—a digital ecosystem where local sellers can showcase their crops, and plant enthusiasts can purchase healthy greenery with confidence, complete with secure transactions and plant health checkups.
            </p>
            <div className='flex gap-10 pt-4'>
              <div>
                <h4 className='text-3xl font-extrabold text-lime-500'>12+</h4>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-wider'>Districts Covered</p>
              </div>
              <div>
                <h4 className='text-3xl font-extrabold text-lime-500'>5k+</h4>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-wider'>Active Members</p>
              </div>
              <div>
                <h4 className='text-3xl font-extrabold text-lime-500'>99%</h4>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-wider'>Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className='py-20 border-t border-b border-gray-100 dark:border-gray-800'>
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <h2 className='text-3xl font-extrabold text-gray-800 dark:text-white mb-4'>Our Core Values</h2>
            <p className='text-gray-500 dark:text-gray-400'>
              The roots that anchor our work and nurture our relationship with plant parents.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {values.map((v, i) => (
              <div key={i} className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 space-y-4'>
                <div className='p-3 bg-lime-50 dark:bg-lime-900/20 w-max rounded-xl'>
                  {v.icon}
                </div>
                <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{v.title}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className='py-20'>
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <h2 className='text-3xl font-extrabold text-gray-800 dark:text-white mb-4'>Meet the Founder</h2>
            <p className='text-gray-500 dark:text-gray-400'>
              The visionary mind behind PlantNet, working to make urban spaces greener.
            </p>
          </div>

          <div className='flex justify-center max-w-lg mx-auto'>
            {team.map((member, i) => (
              <div key={i} className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-center hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center space-y-4 w-full'>
                <img
                  src={member.image}
                  alt={member.name}
                  className='w-28 h-28 rounded-full object-cover border-4 border-lime-100 dark:border-lime-900/30'
                />
                <div>
                  <h3 className='text-lg font-bold text-gray-800 dark:text-white uppercase'>{member.name}</h3>
                  <p className='text-sm font-semibold text-lime-500'>{member.role}</p>
                </div>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AboutUs
