import toast from 'react-hot-toast'

const Newsletter = () => {
    return (
      <div className="bg-lime-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-8 text-lime-50">
            Subscribe to our newsletter for exclusive offers, gardening tips, and
            first access to new arrivals.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              toast.success('Successfully Subscribed!')
              e.target.reset()
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 bg-white rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-300 w-full sm:w-auto flex-1 max-w-sm shadow-sm"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition duration-300 shadow-lg cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Newsletter;
