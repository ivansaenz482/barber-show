import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, ChevronDown, Sparkle, Star, Users } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import { heroBackground } from '../data/images'

const Hero3D = lazy(() => import('./three/Hero3D'))
const ShaderBackdrop = lazy(() => import('./ShaderBackdrop'))

const stats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '8k+', label: 'Cortes realizados' },
  { value: '4.9', label: 'Valoración media', icon: true },
]

function useWebGL() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      setOk(!!gl)
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}

function BarberPole() {
  return (
    <div className="relative mx-auto h-80 w-20 sm:h-96">
      <motion.div
        className="h-full w-full rounded-full bg-gradient-to-b from-primary via-white via-40% to-gold shadow-2xl shadow-primary/40"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg,
            #d4af37 0px, #d4af37 18px,
            #f8fafc 18px, #f8fafc 36px,
            #f0c26b 36px, #f0c26b 54px,
            #f8fafc 54px, #f8fafc 72px)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 px-3 py-2 text-sm font-bold tracking-wide text-primary-light shadow-xl backdrop-blur">
        ✂
      </div>
      <div className="absolute -right-6 top-1/3 rounded-full bg-slate-900/80 px-3 py-2 text-sm font-bold tracking-wide text-gold shadow-xl backdrop-blur">
        ✂
      </div>
    </div>
  )
}

export default function Hero() {
  const webgl = useWebGL()

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBackground}
          alt="Barbería en movimiento"
          className="h-full w-full scale-105 object-cover opacity-30 animate-kenburns"
        />
        {webgl && (
          <div className="absolute inset-0 opacity-70">
            <Suspense fallback={null}>
              <ShaderBackdrop />
            </Suspense>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/85 via-[#0a0a0a]/65 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(2,18,15,0.68)_100%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-light"
          >
            <Star size={14} className="fill-gold text-gold" />
            Exclusive Barber Show
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-black leading-none"
          >
            <span className="block text-5xl tracking-tight text-white sm:text-7xl lg:text-8xl">
              EXCLUSIVE
            </span>
            <span className="mt-3 flex items-center justify-center gap-4 sm:justify-start">
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="hidden h-0.5 w-10 bg-gradient-to-r from-transparent to-primary sm:block"
              />
              <span className="font-display text-2xl font-extrabold tracking-[0.35em] text-gradient-animated sm:text-4xl">
                BARBER SHOW
              </span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="hidden h-0.5 w-10 bg-gradient-to-l from-transparent to-primary sm:block"
              />
            </span>
            <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.6em] text-slate-400 sm:text-sm">
              El arte de cortar bien
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold"
          >
            <Sparkle size={14} className="fill-gold" />
            Estilo que impresiona
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            Cortes clásicos y modernos para adultos, jóvenes y niños. Un espacio donde tradición,
            precisión y estilo se unen para que cada visita sea una experiencia exclusiva.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#citas"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 font-bold text-background shadow-lg shadow-primary/30 transition-transform hover:scale-105"
            >
              <CalendarCheck size={18} />
              Reservar cita
            </a>
            <a
              href="#galeria"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-3.5 font-bold text-primary-light transition-colors hover:bg-primary/10"
            >
              Ver galería
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-3"
          >
            {stats.map((s) => (
              <LiquidGlass
                key={s.label}
                cornerRadius={18}
                blurAmount={0.12}
                saturation={1.4}
                displacementScale={48}
                aberrationIntensity={1.4}
                padding="14px 12px"
                style={{ width: '100%' }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 font-display text-2xl font-extrabold text-white">
                    {s.value}
                    {s.icon && <Star size={16} className="fill-gold text-gold" />}
                  </div>
                  <p className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-slate-300">
                    {s.label}
                  </p>
                </div>
              </LiquidGlass>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 -z-10 mx-auto h-full w-3/4 rounded-[3rem] bg-gradient-to-b from-primary/30 to-accent/10 blur-2xl" />
            <div className="relative h-[520px] w-full">
              {webgl ? (
                <Suspense fallback={<BarberPole />}>
                  <Hero3D />
                </Suspense>
              ) : (
                <BarberPole />
              )}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <LiquidGlass
                cornerRadius={999}
                blurAmount={0.14}
                saturation={1.4}
                displacementScale={56}
                aberrationIntensity={1.6}
                padding="10px 20px"
              >
                <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-100">
                  <Users size={16} className="text-primary-light" />
                  +8,000 clientes felices
                </span>
              </LiquidGlass>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#servicios"
        aria-label="Bajar a servicios"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-light"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  )
}
