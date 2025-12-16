import Plants from '../../components/Home/Plants'
import Banner from '../../components/Home/Banner'
import About from '../../components/Home/About'
import Reviews from '../../components/Home/Reviews/Reviews'
import FAQ from '../../components/Home/FAQ'
import Newsletter from '../../components/Home/Newsletter'

const Home = () => {
  const reviewsPromise = fetch('/reviews.json').then(res => res.json())

  return (
    <div>
      <Banner />
      <Plants />
      <About />
      <Reviews reviewsPromise={reviewsPromise} />
      <FAQ />
      <Newsletter />
    </div>
  )
}

export default Home
