import { motion } from 'framer-motion'
import { BadgePercent, Cake, Gift, PartyPopper } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { useData } from '../context/data-context'

const icons = [BadgePercent, Cake, Gift, PartyPopper]

export default function Promotions() {
  const { promotions } = useData()

  return (
    <section id="promociones" className="border-y border-primary/10 bg-[#060606] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Ofertas"
          title="Promociones y beneficios"
          subtitle="Solo para clientes registrados de Exclusive. Escanea el QR y únete."
        />

        {promotions.length === 0 ? (
          <p className="text-center text-sm text-slate-400">
            Pronto tendremos nuevas promociones. Regístrate para no perderte ninguna.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-primary/15 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50"
              >
                {p.image ? (
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-primary/20 via-card to-gold/10">
                    <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-background shadow-xl shadow-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
                      <i className="[&>svg]:h-10 [&>svg]:w-10">
                        {(() => {
                          const Icon = icons[i % icons.length]
                          return <Icon size={40} />
                        })()}
                      </i>
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
