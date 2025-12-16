import aboutImg from '../../assets/images/about_us.jpg'

const About = () => {
    return (
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <img
                src={aboutImg}
                alt="About Us"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 border-4 border-lime-500 rounded-lg -z-10 hidden md:block"></div>
            </div>
          </div>
  
          {/* Content Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Growing Green, <span className="text-lime-500">Living Better</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At PlantNet, we believe that nature is the root of a happy life.
              Our mission is to bring the serenity of nature into your home, one
              plant at a time. Whether you're a seasoned gardener or just
              starting your green journey, we're here to help you grow.
            </p>
  
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="text-xl font-bold text-lime-600">500+</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Plant Species</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="text-xl font-bold text-lime-600">10k+</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Happy Customers</p>
              </div>
            </div>
  
            <button className="px-8 py-3 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600 transition duration-300 shadow-md">
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;
