import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { FaAndroid, FaDownload, FaSpinner, FaCheckCircle } from 'react-icons/fa'

const DownloadModal = ({ isOpen, setIsOpen }) => {
  const [downloadState, setDownloadState] = useState('idle') // 'idle', 'preparing', 'started'
  const [countdown, setCountdown] = useState(3)
  const apkUrl = import.meta.env.VITE_APK_URL || '/plantnet.apk'

  useEffect(() => {
    if (!isOpen) {
      setDownloadState('idle')
      setCountdown(3)
    }
  }, [isOpen])

  useEffect(() => {
    let timer
    if (downloadState === 'preparing') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      } else {
        // Trigger download
        const link = document.createElement('a')
        link.href = apkUrl
        link.download = 'plantnet.apk'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        setDownloadState('started')
      }
    }
    return () => clearTimeout(timer)
  }, [downloadState, countdown, apkUrl])

  const handleStartDownload = () => {
    setDownloadState('preparing')
    setCountdown(3)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[100]' onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/60 backdrop-blur-xs' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all border border-lime-100 dark:border-gray-700'>
                <DialogTitle
                  as='h3'
                  className='text-2xl font-black text-gray-900 dark:text-white text-center mb-2 flex items-center justify-center gap-2'
                >
                  <FaAndroid className='text-lime-500 text-3xl animate-bounce' />
                  Get PlantNet Mobile
                </DialogTitle>
                <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-6'>
                  Download our official .APK application for Android devices
                </p>

                {downloadState === 'idle' && (
                  <div className='space-y-6'>
                    {/* Features checklist */}
                    <div className='bg-lime-50/50 dark:bg-lime-950/20 rounded-2xl p-5 border border-lime-100/50 dark:border-lime-900/30 space-y-3.5'>
                      <h4 className='font-bold text-sm text-lime-700 dark:text-lime-400 uppercase tracking-wider'>
                        App Highlights:
                      </h4>
                      <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='text-lime-500 font-bold'>✓</span>
                        <span>📸 <strong>AI Plant Scanner:</strong> Identify plant issues instantly.</span>
                      </div>
                      <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='text-lime-500 font-bold'>✓</span>
                        <span>📅 <strong>Weekly Care Routine:</strong> Dynamic tasks checklist.</span>
                      </div>
                      <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='text-lime-500 font-bold'>✓</span>
                        <span>🔔 <strong>Push Reminders:</strong> Never forget to water your plants.</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1.5'>
                      <span>Android 8.0+ Required</span>
                      <span>File Size: ~5.07 MB</span>
                    </div>

                    <button
                      onClick={handleStartDownload}
                      className='w-full py-4 bg-lime-500 hover:bg-lime-600 text-white font-extrabold rounded-2xl transition-all shadow-md shadow-lime-500/20 hover:shadow-lime-500/30 cursor-pointer flex items-center justify-center gap-2 text-base'
                    >
                      <FaDownload />
                      Start Preparing Download
                    </button>
                  </div>
                )}

                {downloadState === 'preparing' && (
                  <div className='flex flex-col items-center justify-center py-10 space-y-6'>
                    <div className='relative flex items-center justify-center'>
                      <FaSpinner className='animate-spin text-lime-500 text-7xl' />
                      <span className='absolute text-2xl font-black text-gray-800 dark:text-white'>
                        {countdown}
                      </span>
                    </div>
                    <div className='text-center space-y-1.5'>
                      <h4 className='font-extrabold text-lg text-gray-800 dark:text-white'>
                        Generating Secure Link
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400 animate-pulse'>
                        {countdown === 3 && 'Locating closest download server...'}
                        {countdown === 2 && 'Allocating bandwidth allocation...'}
                        {countdown === 1 && 'Initiating file stream transfer...'}
                        {countdown === 0 && 'Ready to download!'}
                      </p>
                    </div>
                  </div>
                )}

                {downloadState === 'started' && (
                  <div className='flex flex-col items-center justify-center py-6 space-y-6 text-center animate-fadeIn'>
                    <FaCheckCircle className='text-lime-500 text-6xl animate-pulse' />
                    <div className='space-y-2'>
                      <h4 className='font-black text-xl text-gray-900 dark:text-white'>
                        Download Initiated!
                      </h4>
                      <p className='text-sm text-gray-650 dark:text-gray-300 leading-relaxed px-4'>
                        Your download of <strong>plantnet.apk</strong> has successfully started. Please check your browser or phone downloads folder.
                      </p>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 w-full border border-gray-100 dark:border-gray-800 text-xs text-left text-gray-500 dark:text-gray-400 space-y-1'>
                      <p className='font-bold text-gray-700 dark:text-gray-300 mb-1'>Installation Instructions:</p>
                      <p>1. Open the downloaded `.apk` file.</p>
                      <p>2. Enable "Install from Unknown Sources" if prompted by your system.</p>
                      <p>3. Tap "Install" to complete the setup.</p>
                    </div>

                    <div className='flex w-full gap-3 pt-2'>
                      <button
                        onClick={() => setIsOpen(false)}
                        className='flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition cursor-pointer text-sm'
                      >
                        Close
                      </button>
                      <a
                        href={apkUrl}
                        download='plantnet.apk'
                        className='flex-1 py-3 bg-lime-100 hover:bg-lime-200 dark:bg-lime-950 dark:hover:bg-lime-900 text-lime-700 dark:text-lime-300 font-bold rounded-xl transition cursor-pointer text-sm flex items-center justify-center gap-1.5'
                      >
                        <FaDownload />
                        Retry Download
                      </a>
                    </div>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DownloadModal
