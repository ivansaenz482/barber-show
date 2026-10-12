import { motion } from 'framer-motion'
import { Coffee, Gamepad2, Wifi } from 'lucide-react'
import { waitingImage } from '../data/images'

const perks = [
  { icon: Gamepad2, label: 'PlayStation 5' },
  { icon: Wifi, label: 'WiFi gratis' },
  { icon: Coffee, label: 'Café de cortesía' },
]

export default function WaitingArea() {
  return (
    <section id="sala-espera" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            <Gamepad2 size={14} />
            Sala de espera
          </span>
          <h2 className="mt-5 font-display text-3xl font-black leading-tight text-white sm:text-4xl">
            Juega <span className="text-gradient">PlayStation 5</span> mientras esperas tu turno
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            No esperes aburrido. En Exclusive tenemos una estación con PlayStation 5, mandos y los
            mejores juegos para que la espera sea parte de la experiencia. Ven con tu parcero y
            retense una partida antes del corte.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {perks.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-4 py-2 text-sm font-semibold text-slate-200"
              >
                <p.icon size={16} className="text-primary-light" />
                {p.label}
              </span>
            ))}
          </div>

          <a
            href="#citas"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 font-bold text-background shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            <Gamepad2 size={18} />
            Reservar y venir a jugar
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 shadow-2xl shadow-primary/20">
            <img
              src={waitingImage}
              alt="Clientes jugando PlayStation 5 en Exclusive Barber Show"
              loading="lazy"
              decoding="async"
              className="h-[360px] w-full object-cover sm:h-[440px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm font-bold text-slate-100 backdrop-blur">
              <Gamepad2 size={16} className="text-gold" />
              PS5 disponible en la barbería
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
