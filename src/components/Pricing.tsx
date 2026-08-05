import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeader from './SectionHeader'

const plans = [
  {
    name: 'Clásico',
    price: '$12',
    description: 'Corte esencial para mantener un look impecable.',
    features: ['Corte clásico a máquina y tijera', 'Lavado', 'Perfilado de contorno', 'Secado y peinado'],
  },
  {
    name: 'Premium',
    price: '$20',
    description: 'El ritual completo para los que cuidan cada detalle.',
    features: [
      'Corte clásico o fade',
      'Perfilado y arreglo de barba',
      'Toalla caliente y afeitado de precisión',
      'Lavado con productos premium',
      'Peinado final con cera o pomada',
    ],
    featured: true,
  },
  {
    name: 'Infantil',
    price: '$8',
    description: 'Cortes cómodos y divertidos para los pequeños.',
    features: ['Corte infantil a máquina y tijera', 'Silla especial para niños', 'Lavado y secado', 'Te garantizamos que le encantará el corte'],
  },
]

export default function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Precios"
        title="Planes para cada necesidad"
        subtitle="Precios claros y sin sorpresas. Calidad premium al alcance de todos."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1.5 ${
              plan.featured
                ? 'border-primary bg-gradient-to-b from-primary/15 to-card shadow-2xl shadow-primary/20'
                : 'border-primary/15 bg-card hover:border-primary/40'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-background">
                Más popular
              </span>
            )}
            <h3 className="font-display text-lg font-bold text-white">{plan.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className={`font-display text-5xl font-black ${plan.featured ? 'text-gradient' : 'text-white'}`}>
                {plan.price}
              </span>
              <span className="mb-1.5 text-sm text-slate-400">/ sesión</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15">
                    <Check size={12} className="text-primary-light" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#contacto"
              className={`mt-8 rounded-full py-3 text-center text-sm font-bold transition-all ${
                plan.featured
                  ? 'bg-gradient-to-r from-primary to-accent text-background hover:scale-[1.03]'
                  : 'border border-primary/40 text-primary-light hover:bg-primary/10'
              }`}
            >
              Reservar
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
