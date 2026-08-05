import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Expand, X } from 'lucide-react'
import { galleryImages, type Category } from '../data/images'
import SectionHeader from './SectionHeader'

const filters: { value: Category | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'barberia', label: 'La Barbería' },
  { value: 'cortes', label: 'Cortes' },
  { value: 'adultos', label: 'Adultos' },
  { value: 'jovenes', label: 'Jóvenes' },
]

export default function Gallery() {
  const [active, setActive] = useState<Category | 'todos'>('todos')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const images = useMemo(
    () => (active === 'todos' ? galleryImages : galleryImages.filter((g) => g.category === active)),
    [active],
  )

  const current = galleryImages.find((g) => g.id === lightbox)

  return (
    <section id="galeria" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Galería"
        title="Nuestro trabajo habla"
        subtitle="Resultados reales para adultos y jóvenes. Reemplaza estas imágenes por las fotos actuales de tu barbería."
      />

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              active === f.value
                ? 'bg-gradient-to-r from-primary to-accent text-background shadow-lg shadow-primary/25'
                : 'border border-primary/25 text-slate-300 hover:border-primary/60 hover:text-primary-light'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {images.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-primary/10"
              onClick={() => setLightbox(img.id)}
            >
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#02120f]/90 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm font-semibold text-white">{img.title}</p>
                  <Expand size={18} className="text-primary-light" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightbox && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={current.src.replace('w=900', 'w=1600')}
                alt={current.title}
                className="max-h-[85vh] w-auto object-contain"
              />
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-colors hover:bg-primary"
              >
                <X size={20} />
              </button>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm font-semibold text-white">
                {current.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
