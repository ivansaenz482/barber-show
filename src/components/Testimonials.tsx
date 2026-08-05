import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import SectionHeader from './SectionHeader'

const testimonials = [
  {
    name: 'Carlos Ramírez',
    role: 'Cliente desde 2019',
    quote:
      'El mejor fade que me han hecho en la ciudad. Atención impecable y siempre salgo con un look perfecto.',
    initials: 'CR',
  },
  {
    name: 'Jorge Mendoza',
    role: 'Cliente premium',
    quote:
      'El ritual de barba con toalla caliente es otra cosa. Se nota la pasión por el oficio en cada detalle.',
    initials: 'JM',
  },
  {
    name: 'Andrés Torres',
    role: 'Papá de dos',
    quote:
      'Llevo a mis hijos y se portan genial con ellos. Rápidos, pacientes y el corte siempre queda excelente.',
    initials: 'AT',
  },
]

export default function Testimonials() {
  return (
    <section id="opiniones" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Opiniones"
        title="Lo que dicen nuestros clientes"
        subtitle="Más de 8,000 cortes y cientos de reseñas de 5 estrellas nos respaldan."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative flex flex-col rounded-3xl border border-primary/15 bg-card p-7 transition-all duration-300 hover:border-primary/40"
          >
            <Quote size={36} className="mb-4 text-primary/30" />
            <div className="mb-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-slate-300">“{t.quote}”</p>
            <div className="mt-6 flex items-center gap-3 border-t border-primary/10 pt-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-background">
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
