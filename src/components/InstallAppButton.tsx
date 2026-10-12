import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Share, Smartphone, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'exclusive_install_dismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export default function InstallAppButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (localStorage.getItem(DISMISS_KEY)) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    if (isIos()) setVisible(true)

    const onInstalled = () => setVisible(false)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    setShowHelp(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    if (prompt) {
      await prompt.prompt()
      const choice = await prompt.userChoice
      if (choice.outcome === 'accepted') setVisible(false)
      setPrompt(null)
      return
    }
    setShowHelp(true)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-5 z-[60] flex items-center gap-1 rounded-full border border-primary/30 bg-card/95 p-1 pl-3 shadow-xl shadow-black/40 backdrop-blur sm:bottom-6 sm:left-6"
          >
            <button
              type="button"
              onClick={install}
              className="flex items-center gap-2 py-2 pr-1 text-sm font-bold text-primary-light"
            >
              <Smartphone size={18} />
              Instalar app
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Ocultar"
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition-colors hover:bg-primary/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-primary/25 bg-card p-6 text-center shadow-2xl"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary-light">
                <Download size={26} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                Instala Exclusive en tu teléfono
              </h3>
              <ol className="mt-4 flex flex-col gap-3 text-left text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary-light">
                    1
                  </span>
                  Abre esta página en <span className="font-semibold text-white">Safari</span> (iPhone)
                  o <span className="font-semibold text-white">Chrome</span> (Android).
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary-light">
                    2
                  </span>
                  Toca el botón <Share size={14} className="inline text-primary-light" />{' '}
                  <span className="font-semibold text-white">Compartir</span> (o el menú ⋮ en Chrome).
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary-light">
                    3
                  </span>
                  Elige <span className="font-semibold text-white">Añadir a pantalla de inicio</span> y
                  confirma.
                </li>
              </ol>
              <button
                type="button"
                onClick={dismiss}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-bold text-background"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
