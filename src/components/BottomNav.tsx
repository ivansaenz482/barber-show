import { useEffect, useState } from 'react'
import { CalendarDays, Gift, Home, Menu, ShoppingBag } from 'lucide-react'

const items = [
  { href: '#inicio', label: 'Inicio', icon: Home },
  { href: '#citas', label: 'Citas', icon: CalendarDays },
  { href: '#mi-cuenta', label: 'Mi cuenta', icon: Gift },
  { href: '#tienda', label: 'Tienda', icon: ShoppingBag },
]

export default function BottomNav() {
  const [active, setActive] = useState('#inicio')

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive('#' + e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-card/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map((it) => {
          const Icon = it.icon
          const isActive = active === it.href
          return (
            <li key={it.href} className="flex-1">
              <a
                href={it.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors ${
                  isActive ? 'text-primary-light' : 'text-slate-400'
                }`}
              >
                <Icon size={20} />
                {it.label}
              </a>
            </li>
          )
        })}
        <li className="flex-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('exclusive:open-menu'))}
            className="flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-bold text-slate-400 transition-colors hover:text-primary-light"
          >
            <Menu size={20} />
            Menú
          </button>
        </li>
      </ul>
    </nav>
  )
}
