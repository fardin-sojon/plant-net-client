const Heading = ({ title, subtitle, center }) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <div className='text-2xl font-bold dark:text-white'>{title}</div>
      <div className='font-light text-neutral-500 dark:text-neutral-300 mt-2'>{subtitle}</div>
    </div>
  )
}

export default Heading
