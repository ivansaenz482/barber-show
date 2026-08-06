import AnimatedBackground from './components/AnimatedBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ClientBanner from './components/ClientBanner'
import Marquee from './components/Marquee'
import Services from './components/Services'
import Carousel from './components/Carousel'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Promotions from './components/Promotions'
import Booking from './components/Booking'
import Store from './components/Store'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import ClientRegisterModal from './components/ClientRegisterModal'
import SettingsProvider from './context/SettingsProvider'
import DataProvider from './context/DataProvider'

function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <AnimatedBackground />
        <Navbar />
        <ClientBanner />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <Carousel />
          <Gallery />
          <Pricing />
          <Promotions />
          <Booking />
          <Store />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <AdminPanel />
        <ClientRegisterModal />
      </DataProvider>
    </SettingsProvider>
  )
}

export default App
