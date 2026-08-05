import { motion } from 'framer-motion'
import { CalendarCheck, ChevronDown, Star, Users } from 'lucide-react'

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
            #14b8a6 0px, #14b8a6 18px,
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
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-light"
          >
            <Star size={14} className="fill-gold text-gold" />
            Barbería Premium
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            EL ARTE DE
            <br />
            <span className="text-gradient">CORTAR BIEN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            Cortes clásicos y modernos para adultos, jóvenes y niños. Un espacio donde tradición,
            precisión y estilo se unen para que cada visita sea una experiencia premium.
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
