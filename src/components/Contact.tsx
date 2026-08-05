import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { useSettings } from '../context/settings-context'

const contactInfo = [
  { icon: MapPin, label: 'Dirección', key: 'address' as const },
  { icon: Phone, label: 'Teléfono', key: 'phone' as const },
  { icon: Mail, label: 'Email', key: 'email' as const },
  { icon: MessageCircle, label: 'WhatsApp', key: 'whatsapp' as const },
]

export default function Contact() {
  const { settings } = useSettings()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Contacto"
        title="Reserva tu cita"
        subtitle="Cuéntanos qué necesitas y te confirmaremos tu hora lo antes posible."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 lg:col-span-2"
        >
          {contactInfo.map((info) => (
            <div
              key={info.label}
              className="flex items-start gap-4 rounded-2xl border border-primary/15 bg-card p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-background">
                <info.icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {info.label}
                </p>
                <p className="mt-1 truncate font-semibold text-white">{settings[info.key]}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-primary/15 bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Clock size={20} className="text-primary-light" />
              <h3 className="font-display font-bold text-white">Horario</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {settings.hours.map((h) => (
                <li key={h.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{h.day}</span>
                  <span className="font-semibold text-primary-light">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-primary/15 bg-card p-8 lg:col-span-3"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-slate-300">
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="mb-2 block text-sm font-semibold text-slate-300">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                required
                placeholder="+1 555 000 0000"
                className="w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="servicio" className="mb-2 block text-sm font-semibold text-slate-300">
                Servicio
              </label>
              <select
                id="servicio"
                className="w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option>Corte clásico</option>
                <option>Fade moderno</option>
                <option>Perfilado de barba</option>
                <option>Corte infantil</option>
                <option>Ritual premium</option>
              </select>
            </div>
            <div>
              <label htmlFor="fecha" className="mb-2 block text-sm font-semibold text-slate-300">
                Fecha preferida
              </label>
              <input
                id="fecha"
                type="date"
                className="w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="mensaje" className="mb-2 block text-sm font-semibold text-slate-300">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              rows={4}
              placeholder="Cuéntanos qué estilo buscas..."
              className="w-full resize-none rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-4 font-bold text-background transition-transform hover:scale-[1.02]"
          >
            <Send size={18} />
            Enviar solicitud
          </button>

          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary-light"
            >
              ¡Gracias! Hemos recibido tu solicitud. Te contactaremos muy pronto.
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
