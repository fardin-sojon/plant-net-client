import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { FaLeaf, FaTint, FaSun, FaCheckCircle, FaPlus, FaTrash, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'

const PlantCare = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()
  const userEmail = user?.email || user?.providerData?.[0]?.email

  // Fetch customer orders to know what plants they own
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['customer-orders-care', userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const { data } = await axiosSecure(`/my-orders/${userEmail}`)
      return data
    },
  })

  // Unique plants purchased
  const purchasedPlants = Array.from(new Set(orders.map((o) => o.name))).map((name) => {
    return orders.find((o) => o.name === name)
  })

  // Local state for planner tasks
  const [tasks, setTasks] = useState([])

  // Load tasks from localStorage when userEmail changes
  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem(`plant_care_tasks_${userEmail}`)
      if (saved) {
        setTasks(JSON.parse(saved))
      } else {
        setTasks([
          { id: '1', plant: 'Monstera Deliciosa', type: 'Watering', day: 'Monday', completed: false },
          { id: '2', plant: 'Aloe Vera', type: 'Sunlight Exposure', day: 'Wednesday', completed: true },
          { id: '3', plant: 'Monstera Deliciosa', type: 'Fertilizing', day: 'Friday', completed: false }
        ])
      }
    }
  }, [userEmail])

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`plant_care_tasks_${userEmail}`, JSON.stringify(tasks))
    }
  }, [tasks, userEmail])

  // Form states
  const [selectedPlant, setSelectedPlant] = useState('')
  const [selectedType, setSelectedType] = useState('Watering')
  const [selectedDay, setSelectedDay] = useState('Monday')

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!selectedPlant) {
      toast.error('Please select a plant')
      return
    }

    const newTask = {
      id: Date.now().toString(),
      plant: selectedPlant,
      type: selectedType,
      day: selectedDay,
      completed: false,
    }

    setTasks([...tasks, newTask])
    toast.success('Care task scheduled successfully!')
    setSelectedPlant('')
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
    toast.success('Task removed')
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (isLoading) return <LoadingSpinner />

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Plant Care Planner</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          Schedule watering, fertilizing, and sunlight exposure tasks for your home garden
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Add Task Form */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 h-fit'>
          <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2'>
            <FaPlus className='text-lime-500 w-4 h-4' /> Schedule New Task
          </h2>

          <form onSubmit={handleAddTask} className='flex flex-col gap-4'>
            {/* Plant selection */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Select Plant</label>
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className='px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500'
              >
                <option value=''>-- Choose Plant --</option>
                <option value='My Home Plant'>My Home Plant (General)</option>
                {purchasedPlants.map((plant) => (
                  <option key={plant._id} value={plant.name}>
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Care Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500'
              >
                <option value='Watering'>Watering 💧</option>
                <option value='Fertilizing'>Fertilizing 🌱</option>
                <option value='Sunlight Exposure'>Sunlight Exposure ☀️</option>
                <option value='Pruning'>Pruning ✂️</option>
              </select>
            </div>

            {/* Day of Week */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Scheduled Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className='px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500'
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <button
              type='submit'
              className='mt-4 w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex justify-center items-center gap-2'
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Weekly Checklist Cards */}
        <div className='lg:col-span-2 flex flex-col gap-6'>
          {daysOfWeek.map((day) => {
            const dayTasks = tasks.filter((task) => task.day === day)
            return (
              <div
                key={day}
                className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6'
              >
                <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex justify-between items-center'>
                  {day}
                  <span className='text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 font-medium'>
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </h3>

                {dayTasks.length === 0 ? (
                  <p className='text-sm text-gray-400 dark:text-gray-500 italic'>
                    No care tasks scheduled for {day}.
                  </p>
                ) : (
                  <div className='flex flex-col gap-3'>
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                          task.completed
                            ? 'bg-lime-50/50 dark:bg-lime-950/10 border-lime-200 dark:border-lime-900/50 text-gray-500 dark:text-gray-400'
                            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                              task.completed
                                ? 'bg-lime-500 border-lime-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-lime-500'
                            }`}
                          >
                            {task.completed && <FaCheck className='w-3 h-3' />}
                          </button>

                          <div>
                            <span className={`font-semibold text-sm ${task.completed ? 'line-through' : ''}`}>
                              {task.plant}
                            </span>
                            <div className='flex items-center gap-1.5 mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                              {task.type === 'Watering' && <FaTint className='text-blue-500' />}
                              {task.type === 'Fertilizing' && <FaLeaf className='text-lime-500' />}
                              {task.type === 'Sunlight Exposure' && <FaSun className='text-amber-500' />}
                              <span>{task.type}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className='p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer'
                        >
                          <FaTrash className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlantCare
