import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, QrCode, Share2, X } from 'lucide-react'
import { WhatsappIcon } from '../lib/social-icons'

export default function ShareQr({
  className = '',
  label = 'Compartir página',
  iconOnly = false,
}: {
  className?: string
  label?: string
  iconOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&qzone=2&data=${encodeURIComponent(url)}`
  const waText = `Reserva tu corte en Exclusive Barber Show ✂️ ${url}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Exclusive Barber Show', text: waText, url })
        return
      } catch {
        /* ignore */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank', 'noopener')
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <QrCode size={15} />
        {!iconOnly && label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 24, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-primary/25 bg-card p-6 text-center shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary-light">
                  <Share2 size={18} />
                  <h3 className="font-display text-lg font-bold text-white">Comparte Exclusive</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-primary/20 text-slate-300 transition-colors hover:bg-primary/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                Escanea el código o comparte el enlace para que tus clientes reserven su cita.
              </p>

              <img
                src={qr}
                alt="Código QR de Exclusive Barber Show"
                width={220}
                height={220}
                loading="lazy"
                className="mx-auto mt-4 rounded-2xl border border-primary/25 bg-white p-3"
              />

              <p className="mt-3 break-all text-xs text-slate-400">{url}</p>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3 font-bold text-background transition-transform hover:scale-[1.02]"
                >
                  <WhatsappIcon size={18} />
                  Compartir por WhatsApp
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 py-3 font-bold text-primary-light transition-colors hover:bg-primary/10"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? '¡Copiado!' : 'Copiar enlace'}
                  </button>
                  <a
                    href={qr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 px-4 py-3 font-bold text-primary-light transition-colors hover:bg-primary/10"
                  >
                    <QrCode size={16} />
                    Abrir QR
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
