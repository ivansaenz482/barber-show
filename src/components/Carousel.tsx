import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { carouselSlides } from '../data/images'
import SectionHeader from './SectionHeader'

export default function Carousel() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const paginate = useCallback((dir: number) => {
    setIndex(([prev]) => [(prev + dir + carouselSlides.length) % carouselSlides.length, dir])
  }, [])

  const goTo = useCallback((i: number) => {
    setIndex(([prev]) => [i, i > prev ? 1 : -1])
  }, [])

  useEffect(() => {
    timer.current = setInterval(() => paginate(1), 5500)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [index, paginate])

  const slide = carouselSlides[index]

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Nuestro trabajo"
        title="Carrusel de estilo"
        subtitle="Un vistazo a los resultados que nos hacen la barbería favorita de la ciudad."
      />

      <div
        className="group relative aspect-[16/9] overflow-hidden rounded-3xl border border-primary/15 shadow-2xl shadow-black/40"
        onMouseEnter={() => timer.current && clearInterval(timer.current)}
        onMouseLeave={() => {
          if (timer.current) clearInterval(timer.current)
          timer.current = setInterval(() => paginate(1), 5500)
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 1.05 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.src}
              alt={slide.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.3em] text-accent"
              >
                Exclusive Barber Show
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="mt-2 font-display text-2xl font-extrabold text-white sm:text-4xl"
              >
                {slide.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.5 }}
                className="mt-2 max-w-lg text-sm text-slate-200 sm:text-base"
              >
                {slide.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-900/60 text-white opacity-0 backdrop-blur transition-all hover:bg-primary group-hover:opacity-100"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-900/60 text-white opacity-0 backdrop-blur transition-all hover:bg-primary group-hover:opacity-100"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-5 right-6 flex gap-2">
          {carouselSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a diapositiva ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-primary' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
