import { motion } from 'framer-motion'
import { Cake, QrCode, UserPlus } from 'lucide-react'
import { useData } from '../context/data-context'

export default function ClientBanner() {
  const { currentClient, openRegister, isBirthday } = useData()

  if (!currentClient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/90 via-accent/90 to-primary/90"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-5 py-3 text-center sm:flex-row sm:gap-5 lg:px-8">
          <p className="text-sm font-semibold text-background">
            <QrCode size={15} className="mr-1.5 inline-block" />
            Escanea el QR de la barbería y regístrate para obtener beneficios.
          </p>
          <button
            type="button"
            onClick={() => openRegister()}
            className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-4 py-1.5 text-xs font-bold text-primary-light transition-transform hover:scale-105"
          >
            <UserPlus size={14} />
            Registrarme
          </button>
        </div>
      </motion.div>
    )
  }

  if (isBirthday) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gold via-[#f0c26b] to-gold"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-5 py-3 text-center sm:flex-row sm:gap-4 lg:px-8">
          <Cake size={18} className="text-background" />
          <p className="text-sm font-extrabold text-background">
            ¡Feliz cumpleaños, {currentClient.name.split(' ')[0]}! Hoy tu corte es GRATIS en Exclusive.
          </p>
        </div>
      </motion.div>
    )
  }

  return null
}
