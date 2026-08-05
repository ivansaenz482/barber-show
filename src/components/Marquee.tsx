import { Scissors } from 'lucide-react'

const items = [
  'CORTE CLÁSICO',
  'FADE MODERNO',
  'PERFILADO DE BARBA',
  'ARREGLOS PARA NIÑOS',
  'PEINADO Y ESTILO',
  'RITUAL PREMIUM',
]

export default function Marquee() {
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-primary/20 bg-primary/5 py-4">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-display text-sm font-bold tracking-[0.25em] text-primary-light"
          >
            {item}
            <Scissors size={16} className="text-gold" />
          </span>
        ))}
      </div>
    </div>
  )
}
