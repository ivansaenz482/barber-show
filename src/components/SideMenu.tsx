import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Menu, X } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { useSettings } from '../context/settings-context'
import { themeDef } from '../lib/themes'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Precios', href: '#precios' },
  { label: 'Promociones', href: '#promociones' },
  { label: 'Citas', href: '#citas' },
  { label: 'Mi cuenta', href: '#mi-cuenta' },
  { label: 'Tienda', href: '#tienda' },
  { label: 'Contacto', href: '#contacto' },
]

export default function SideMenu() {
  const [open, setOpen] = useState(false)
  const { settings } = useSettings()
  const theme = themeDef(settings.theme)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="fixed right-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-2xl border border-r-0 border-primary/30 bg-card/85 px-2 py-4 text-primary-light shadow-lg backdrop-blur transition-colors hover:bg-primary/15"
      >
        <Menu size={20} />
        <span className="text-[9px] font-bold uppercase tracking-wider [writing-mode:vertical-rl]">
          Menú
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
              className="fixed right-0 top-0 z-[90] flex h-full w-72 max-w-[85vw] flex-col border-l border-primary/20 bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <BrandLogo size="sm" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-primary/20 text-slate-300 transition-colors hover:bg-primary/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {theme.key !== 'normal' && (
                <span className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-light">
                  <span>{theme.emoji}</span>
                  {theme.label}
                </span>
              )}

              <nav className="mt-7 flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary-light"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <a
                href="#citas"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3.5 font-bold text-background transition-transform hover:scale-[1.02]"
              >
                <CalendarCheck size={18} />
                Reservar cita
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
