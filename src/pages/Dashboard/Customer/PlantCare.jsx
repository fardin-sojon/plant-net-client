import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { FaLeaf, FaTint, FaSun, FaCheckCircle, FaPlus, FaTrash, FaCheck, FaClock, FaExclamationCircle, FaNotesMedical, FaFire } from 'react-icons/fa'
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
          { id: '1', plant: 'Kath Golap', type: 'Watering', day: 'Monday', time: '08:00', priority: 'High', notes: '500ml lukewarm water', completed: false },
          { id: '2', plant: 'Aloe Vera', type: 'Sunlight Exposure', day: 'Wednesday', time: '10:00', priority: 'Normal', notes: 'Place near balcony window', completed: true },
          { id: '3', plant: 'Monstera Deliciosa', type: 'Fertilizing', day: 'Friday', time: '17:00', priority: 'High', notes: 'Organic liquid fertilizer 1 tbsp', completed: false }
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
  const [selectedTime, setSelectedTime] = useState('08:00')
  const [selectedPriority, setSelectedPriority] = useState('Normal')
  const [notes, setNotes] = useState('')

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
      time: selectedTime || '08:00',
      priority: selectedPriority || 'Normal',
      notes: notes.trim() || '',
      completed: false,
    }

    setTasks([...tasks, newTask])
    toast.success('Care task scheduled successfully!')
    setSelectedPlant('')
    setNotes('')
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed
          if (nextCompleted) {
            toast.success('Great job! Care task completed 🎉')
          }
          return { ...task, completed: nextCompleted }
        }
        return task
      })
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
    toast.success('Task removed')
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Summary Metrics
  const totalTasks = tasks.length
  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = tasks.filter(t => !t.completed).length

  // Helper to format 24h time to 12h AM/PM
  const formatTime12h = (time24) => {
    if (!time24) return '08:00 AM'
    const [h, m] = time24.split(':')
    let hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12 || 12
    return `${hour}:${m} ${ampm}`
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Plant Care Planner</h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
          Schedule watering, fertilizing, sunlight, and custom care tasks for your home garden
        </p>
      </div>

      {/* Smart Seasonal Care Tip Banner */}
      <div className='mb-8 bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-teal-500/10 dark:from-lime-950/40 dark:to-emerald-950/40 border border-lime-200 dark:border-lime-800/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-lime-500 text-white rounded-xl text-lg shadow-sm'>
            <FaLeaf />
          </div>
          <div>
            <h4 className='font-bold text-sm text-gray-800 dark:text-white'>Smart Care Recommendation</h4>
            <p className='text-xs text-gray-600 dark:text-gray-300 mt-0.5'>
              Water your plants in the early morning (before 9 AM) to minimize evaporation and prevent root rot!
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-xs'>
          <div className='p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl text-base'>
            <FaCheckCircle />
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-400'>Total Scheduled</p>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{totalTasks} Tasks</h3>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-xs'>
          <div className='p-3 bg-lime-100 dark:bg-lime-950/40 text-lime-600 dark:text-lime-400 rounded-xl text-base'>
            <FaCheck />
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-400'>Completed</p>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{completedCount} Done</h3>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-xs'>
          <div className='p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl text-base'>
            <FaClock />
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-400'>Pending</p>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{pendingCount} Remaining</h3>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 shadow-xs'>
          <div className='p-3 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl text-base'>
            <FaFire />
          </div>
          <div>
            <p className='text-xs font-semibold text-gray-400'>Care Streak</p>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{completedCount > 0 ? `${completedCount} Days 🔥` : '0 Days'}</h3>
          </div>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-3 items-start'>
        {/* Add Task Form */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700 sticky top-4'>
          <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2'>
            <FaPlus className='text-lime-500 w-4 h-4' /> Schedule New Task
          </h2>

          <form onSubmit={handleAddTask} className='flex flex-col gap-4'>
            {/* Plant selection */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Select Plant</label>
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className='px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition text-sm font-semibold'
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
              <label className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Care Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition text-sm font-semibold'
              >
                <option value='Watering'>Watering 💧</option>
                <option value='Fertilizing'>Fertilizing 🌱</option>
                <option value='Sunlight Exposure'>Sunlight Exposure ☀️</option>
                <option value='Pruning'>Pruning & Trimming ✂️</option>
                <option value='Cleaning'>Leaf Cleaning 🧴</option>
              </select>
            </div>

            {/* Day & Time Grid */}
            <div className='grid grid-cols-2 gap-3'>
              {/* Day of Week */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Scheduled Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className='px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition text-sm font-semibold'
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Picker */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Care Time ⏰</label>
                <input
                  type='time'
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className='px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition text-sm font-semibold'
                />
              </div>
            </div>

            {/* Priority Level */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Priority Level</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className='px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition text-sm font-semibold'
              >
                <option value='Normal'>Normal Priority 🟢</option>
                <option value='High'>High / Urgent 🔴</option>
                <option value='Low'>Low Priority 🟡</option>
              </select>
            </div>

            {/* Notes / Dose */}
            <div className='flex flex-col gap-1'>
              <label className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Dose / Custom Notes</label>
              <input
                type='text'
                placeholder='e.g. 500ml water, 1 cup fertilizer...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition text-sm'
              />
            </div>

            <button
              type='submit'
              className='mt-2 w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex justify-center items-center gap-2 text-sm'
            >
              <FaPlus /> Add Care Task
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
                <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center'>
                  <span>{day}</span>
                  <span className='text-xs px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 font-bold'>
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </h3>

                {dayTasks.length === 0 ? (
                  <p className='text-sm text-gray-400 dark:text-gray-500 italic py-2'>
                    No care tasks scheduled for {day}.
                  </p>
                ) : (
                  <div className='flex flex-col gap-3'>
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start justify-between p-4 rounded-2xl border transition-all duration-200 ${
                          task.completed
                            ? 'bg-lime-50/50 dark:bg-lime-950/10 border-lime-200 dark:border-lime-900/50 text-gray-400 dark:text-gray-500'
                            : 'bg-gray-50/70 dark:bg-gray-900/50 border-gray-100 dark:border-gray-750 text-gray-800 dark:text-white'
                        }`}
                      >
                        <div className='flex items-start gap-3.5'>
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all cursor-pointer mt-0.5 flex-shrink-0 ${
                              task.completed
                                ? 'bg-lime-500 border-lime-500 text-white shadow-sm'
                                : 'border-gray-300 dark:border-gray-600 hover:border-lime-500'
                            }`}
                          >
                            {task.completed && <FaCheck className='w-3 h-3' />}
                          </button>

                          <div className='space-y-1'>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <span className={`font-bold text-base ${task.completed ? 'line-through' : ''}`}>
                                {task.plant}
                              </span>
                              {task.priority === 'High' && (
                                <span className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 uppercase'>
                                  High Priority 🔴
                                </span>
                              )}
                              {task.priority === 'Low' && (
                                <span className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 uppercase'>
                                  Low Priority 🟡
                                </span>
                              )}
                            </div>

                            <div className='flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 flex-wrap pt-0.5'>
                              <div className='flex items-center gap-1.5'>
                                {task.type === 'Watering' && <FaTint className='text-blue-500' />}
                                {task.type === 'Fertilizing' && <FaLeaf className='text-lime-500' />}
                                {task.type === 'Sunlight Exposure' && <FaSun className='text-amber-500' />}
                                {task.type === 'Pruning' && <span className='text-purple-500'>✂️</span>}
                                {task.type === 'Cleaning' && <span className='text-teal-500'>🧴</span>}
                                <span className='font-bold text-gray-700 dark:text-gray-200'>{task.type}</span>
                              </div>

                              <div className='flex items-center gap-1 text-lime-600 dark:text-lime-400 font-mono font-bold bg-lime-50 dark:bg-lime-950/40 px-2 py-0.5 rounded-md'>
                                <FaClock className='text-xs' />
                                <span>{formatTime12h(task.time)}</span>
                              </div>
                            </div>

                            {task.notes && (
                              <p className='text-xs italic text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 w-fit mt-1'>
                                📝 {task.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className='p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer flex-shrink-0'
                          title='Delete task'
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
