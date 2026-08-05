import { AtSign, Camera, MessageCircle, Scissors } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-primary/15 bg-[#010b09]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#inicio" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-background">
              <Scissors size={20} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-widest text-white">
              BARBER<span className="text-primary"> SHOW</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Barbería premium con cortes clásicos y modernos para adultos, jóvenes y niños. Tu
            imagen es nuestra pasión.
          </p>
          <div className="mt-6 flex gap-3">
            {[Camera, MessageCircle, AtSign].map((Icon, i) => (
              <a
                key={i}
                href="#inicio"
                aria-label="Red social"
                className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 text-primary-light transition-colors hover:bg-primary hover:text-background"
              >
                <Icon size={18} />
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
            <li>Av. Principal 123, Centro</li>
            <li>+1 555 123 4567</li>
            <li>hola@barbershow.com</li>
            <li>Lun–Sáb: 9:00 – 21:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary/10 py-6">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Barber Show. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
