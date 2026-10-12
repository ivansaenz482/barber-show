import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Share, Smartphone, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PwaWindow extends Window {
  __pwaPrompt?: BeforeInstallPromptEvent | null
  __pwaInstalled?: boolean
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

function isMobileUa() {
  return /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent)
}

export default function InstallAppButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return

    const w = window as PwaWindow
    const sync = () => {
      const p = w.__pwaPrompt ?? null
      setPrompt(p)
      setVisible(!w.__pwaInstalled && (!!p || isIos() || isMobileUa()))
    }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      w.__pwaPrompt = e as BeforeInstallPromptEvent
      sync()
    }
    const onInstalled = () => {
      w.__pwaInstalled = true
      setVisible(false)
      setShowHelp(false)
    }
    const onOpen = async () => {
      const p = (window as PwaWindow).__pwaPrompt ?? null
      if (p) {
        try {
          await p.prompt()
          await p.userChoice
          ;(window as PwaWindow).__pwaPrompt = null
          setVisible(false)
          return
        } catch {
          /* fall through */
        }
      }
      setShowHelp(true)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener('pwa-prompt-ready', sync)
    window.addEventListener('exclusive:open-install', onOpen)
    sync()

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('pwa-prompt-ready', sync)
      window.removeEventListener('exclusive:open-install', onOpen)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    setShowHelp(false)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    const w = window as PwaWindow
    const p = prompt ?? w.__pwaPrompt ?? null
    if (p) {
      try {
        await p.prompt()
        const choice = await p.userChoice
        if (choice.outcome === 'accepted') {
          setVisible(false)
          setShowHelp(false)
        }
        w.__pwaPrompt = null
        setPrompt(null)
        return
      } catch {
        /* fall through to help */
      }
    }
    setShowHelp(true)
  }

  const steps = isIos()
    ? [
        { icon: <Share size={14} className="inline text-primary-light" />, text: 'Toca el botón Compartir en Safari.' },
        { text: 'Elige "Añadir a pantalla de inicio".' },
        { text: 'Confirma con "Añadir". ¡Listo!' },
      ]
    : isMobileUa()
      ? [
          { text: 'Abre el menú del navegador (⋮ arriba a la derecha).' },
          { text: 'Toca "Instalar aplicación" o "Añadir a pantalla principal".' },
          { text: 'Confirma. La app quedará en tu teléfono.' },
        ]
      : [
          { text: 'Busca el icono de instalar en la barra de direcciones (Chrome/Edge).' },
          { text: 'O menú ⋮ → "Instalar Exclusive".' },
          { text: 'Confirma y se abrirá como app.' },
        ]

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-5 z-[60] flex items-center gap-1 rounded-full border border-primary/30 bg-card/95 p-1 pl-3 shadow-xl shadow-black/40 backdrop-blur lg:bottom-6 lg:left-6"
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
            className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
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
                {steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary-light">
                      {i + 1}
                    </span>
                    <span>
                      {s.icon} {s.text}
                    </span>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
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
