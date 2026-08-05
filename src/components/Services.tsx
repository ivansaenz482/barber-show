import { motion } from 'framer-motion'
import {
  Baby,
  Scissors,
  Slice,
  Sparkles,
  SprayCan,
  UserRound,
  Waves,
} from 'lucide-react'
import SectionHeader from './SectionHeader'

const services = [
  {
    icon: Scissors,
    title: 'Corte Clásico',
    description: 'Corte con tijera, precisión y acabado tradicional para un look elegante.',
    audience: 'Adultos',
  },
  {
    icon: Slice,
    title: 'Perfilado de Barba',
    description: 'Diseño, afeitado con toalla caliente y cuidado de barba con productos premium.',
    audience: 'Adultos',
  },
  {
    icon: Waves,
    title: 'Fade Moderno',
    description: 'Degradados técnicos, skin fade y tendencias actuales para marcar estilo.',
    audience: 'Jóvenes',
  },
  {
    icon: Sparkles,
    title: 'Peinado y Estilo',
    description: 'Lavado, moldeado y fijación con las mejores ceras y pomadas del mercado.',
    audience: 'Jóvenes',
  },
  {
    icon: Baby,
    title: 'Corte Infantil',
    description: 'Cortes cómodos, rápidos y divertidos pensados para los más pequeños.',
    audience: 'Niños',
  },
  {
    icon: SprayCan,
    title: 'Ritual Premium',
    description: 'Experiencia completa: corte, barba, toalla caliente y finalización de lujo.',
    audience: 'Todos',
  },
]

export default function Services() {
  return (
    <section id="servicios" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Nuestros servicios"
        title="Para cada estilo y cada edad"
        subtitle="Servicios especializados para adultos, jóvenes y niños, siempre con atención personalizada y productos de primera calidad."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-primary/15 bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
            <div className="mb-5 inline-grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary-light transition-colors group-hover:text-accent">
              <service.icon size={26} />
            </div>
            <span className="mb-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
              {service.audience}
            </span>
            <h3 className="font-display text-xl font-bold text-white">{service.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{service.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        {[
          { icon: UserRound, label: 'Adultos' },
          { icon: Waves, label: 'Jóvenes' },
          { icon: Baby, label: 'Niños' },
        ].map((g) => (
          <span
            key={g.label}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-light"
          >
            <g.icon size={16} />
            {g.label}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
