import AnimatedBackground from './components/AnimatedBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Services from './components/Services'
import Carousel from './components/Carousel'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import SettingsProvider from './context/SettingsProvider'

function App() {
  return (
    <SettingsProvider>
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Carousel />
        <Gallery />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <AdminPanel />
    </SettingsProvider>
  )
}

export default App
