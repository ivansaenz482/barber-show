import { useState } from 'react'
import { Scissors } from 'lucide-react'

export default function BrandLogo({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md'
  className?: string
}) {
  const [imgOk, setImgOk] = useState(true)
  const height = size === 'sm' ? 'h-11' : 'h-14'

  if (imgOk) {
    return (
      <img
        src="/logo.jpg"
        alt="Exclusive Barber Show"
        onError={() => setImgOk(false)}
        className={`${height} w-auto rounded-lg object-contain ${className}`}
      />
    )
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-background shadow-lg shadow-primary/30">
        <Scissors size={22} strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-black tracking-[0.18em] text-gradient-animated">
          EXCLUSIVE
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.52em] text-slate-300">
          Barber <span className="text-primary-light">Show</span>
        </span>
      </span>
    </span>
  )
}
