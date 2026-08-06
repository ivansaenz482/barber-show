import { Globe, Scissors, Settings } from 'lucide-react'
import { useSettings } from '../context/settings-context'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="border-t border-primary/15 bg-[#060606]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#inicio" className="flex items-center gap-3">
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
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Barbería premium con cortes clásicos y modernos para adultos, jóvenes y niños. Tu
            imagen es nuestra pasión.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {settings.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 text-primary-light transition-colors hover:bg-primary hover:text-background"
              >
                <Globe size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Navegación
          </h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            {[
              ['Inicio', '#inicio'],
              ['Servicios', '#servicios'],
              ['Galería', '#galeria'],
              ['Precios', '#precios'],
              ['Contacto', '#contacto'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-primary-light">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Servicios
          </h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            {['Corte clásico', 'Fade moderno', 'Perfilado de barba', 'Corte infantil', 'Ritual premium'].map(
              (s) => (
                <li key={s}>{s}</li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Contacto
          </h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <li>{settings.address}</li>
            <li>{settings.phone}</li>
            <li>{settings.email}</li>
            {settings.hours.slice(0, 2).map((h) => (
              <li key={h.id}>
                {h.day}: {h.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 sm:flex-row lg:px-8">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Exclusive Barber Show. Todos los derechos reservados.
          </p>
          <a
            href="#admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-primary-light"
          >
            <Settings size={13} />
            Administrar página
          </a>
        </div>
      </div>
    </footer>
  )
}
