import { motion } from 'framer-motion'
import { WhatsappIcon } from '../lib/social-icons'
import { buildWhatsAppLink } from '../lib/whatsapp'
import { useSettings } from '../context/settings-context'

export default function FloatingWhatsApp() {
  const { settings } = useSettings()

  return (
    <motion.a
      href={buildWhatsAppLink(settings.whatsapp, 'Hola, me gustaría reservar una cita en Exclusive Barber Show')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent p-2 pl-4 text-background shadow-xl shadow-primary/40 sm:bottom-6 sm:right-6"
    >
      <span className="hidden text-sm font-bold sm:block">Reservar por WhatsApp</span>
      <span className="relative grid h-12 w-12 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-background text-primary-light">
          <WhatsappIcon size={26} />
        </span>
      </span>
    </motion.a>
  )
}
