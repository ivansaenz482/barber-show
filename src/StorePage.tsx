import { ArrowLeft } from 'lucide-react'
import AnimatedBackground from './components/AnimatedBackground'
import Store from './components/Store'
import ClientRegisterModal from './components/ClientRegisterModal'
import DataProvider from './context/DataProvider'
import SettingsProvider from './context/SettingsProvider'

export default function StorePage() {
  return (
    <SettingsProvider>
      <DataProvider>
        <AnimatedBackground />
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <a
            href="./index.html"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary-light transition-colors hover:bg-primary/10"
          >
            <ArrowLeft size={16} />
            Volver a la página principal
          </a>
        </div>
        <main>
          <Store />
        </main>
        <ClientRegisterModal />
      </DataProvider>
    </SettingsProvider>
  )
}
