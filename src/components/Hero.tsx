import { motion } from 'framer-motion'
import { CalendarCheck, ChevronDown, Sparkle, Star, Users } from 'lucide-react'
import { heroBackground } from '../data/images'

const stats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '8k+', label: 'Cortes realizados' },
  { value: '4.9', label: 'Valoración media', icon: true },
]

function BarberPole() {
  return (
    <div className="relative mx-auto h-80 w-20 sm:h-96">
      <motion.div
        className="h-full w-full rounded-full bg-gradient-to-b from-primary via-white via-40% to-gold shadow-2xl shadow-primary/40"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg,
            #d4af37 0px, #d4af37 18px,
            #f8fafc 18px, #f8fafc 36px,
            #f0c26b 36px, #f0c26b 54px,
            #f8fafc 54px, #f8fafc 72px)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 px-3 py-2 text-sm font-bold tracking-wide text-primary-light shadow-xl backdrop-blur">
        ✂
      </div>
      <div className="absolute -right-6 top-1/3 rounded-full bg-slate-900/80 px-3 py-2 text-sm font-bold tracking-wide text-gold shadow-xl backdrop-blur">
        ✂
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBackground}
          alt="Barbería en movimiento"
          className="h-full w-full scale-105 object-cover opacity-40 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/85 via-[#0a0a0a]/70 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,18,15,0.6)_100%)]" />
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-light"
          >
            <Star size={14} className="fill-gold text-gold" />
            Exclusive Barber Show
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-black leading-none"
          >
            <span className="block text-5xl tracking-tight text-white sm:text-7xl lg:text-8xl">
              EXCLUSIVE
            </span>
            <span className="mt-3 flex items-center justify-center gap-4 sm:justify-start">
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="hidden h-0.5 w-10 bg-gradient-to-r from-transparent to-primary sm:block"
              />
              <span className="font-display text-2xl font-extrabold tracking-[0.35em] text-gradient-animated sm:text-4xl">
                BARBER SHOW
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="hidden h-0.5 w-10 bg-gradient-to-l from-transparent to-primary sm:block"
              />
            </span>
            <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.6em] text-slate-400 sm:text-sm">
              El arte de cortar bien
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold"
          >
            <Sparkle size={14} className="fill-gold" />
            Estilo que impresiona
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            Cortes clásicos y modernos para adultos, jóvenes y niños. Un espacio donde tradición,
            precisión y estilo se unen para que cada visita sea una experiencia exclusiva.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 font-bold text-background shadow-lg shadow-primary/30 transition-transform hover:scale-105"
            >
              <CalendarCheck size={18} />
              Reservar cita
            </a>
            <a
              href="#galeria"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-3.5 font-bold text-primary-light transition-colors hover:bg-primary/10"
            >
              Ver galería
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-primary/15 pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="flex items-center gap-1 font-display text-3xl font-extrabold text-white">
                  {s.value}
                  {s.icon && <Star size={20} className="fill-gold text-gold" />}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 -z-10 mx-auto h-full w-3/4 rounded-[3rem] bg-gradient-to-b from-primary/30 to-accent/10 blur-2xl" />
            <BarberPole />
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900/70 px-5 py-2.5 text-sm font-semibold text-slate-200 shadow-xl backdrop-blur">
              <Users size={16} className="text-primary-light" />
              +8,000 clientes felices
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#servicios"
        aria-label="Bajar a servicios"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-light"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  )
}
