import { useEffect, useRef } from 'react'
import { useSettings } from '../context/settings-context'
import type { ThemeKey } from '../lib/themes'

type Mode = 'fall' | 'rise' | 'fly'

interface Cfg {
  shape: 'emoji' | 'circle'
  emoji?: string
  color?: string
  count: number
  mode: Mode
  size: [number, number]
  speed: [number, number]
  opacity: number
  boost?: number
}

const CFG: Partial<Record<ThemeKey, Cfg>> = {
  navidad: {
    shape: 'circle',
    color: '#ffffff',
    count: 34,
    mode: 'fall',
    size: [3, 8],
    speed: [0.5, 1.4],
    opacity: 0.85,
  },
  halloween: {
    shape: 'emoji',
    emoji: '🦇',
    count: 11,
    mode: 'fly',
    size: [20, 34],
    speed: [0.9, 1.9],
    opacity: 0.95,
    boost: 3.2,
  },
  'san-valentin': {
    shape: 'emoji',
    emoji: '❤️',
    count: 16,
    mode: 'rise',
    size: [14, 26],
    speed: [0.3, 0.9],
    opacity: 0.85,
  },
  'dia-padre': {
    shape: 'emoji',
    emoji: '⭐',
    count: 20,
    mode: 'fall',
    size: [12, 22],
    speed: [0.3, 0.9],
    opacity: 0.8,
  },
  escolar: {
    shape: 'emoji',
    emoji: '✏️',
    count: 16,
    mode: 'fall',
    size: [16, 28],
    speed: [0.3, 1.0],
    opacity: 0.85,
  },
  playera: {
    shape: 'circle',
    color: '#ffffff',
    count: 20,
    mode: 'rise',
    size: [4, 11],
    speed: [0.3, 0.9],
    opacity: 0.45,
  },
}

interface Particle {
  x: number
  y: number
  size: number
  v: number
  phase: number
  sway: number
  rot: number
  vr: number
}

export default function SeasonalEffects() {
  const { settings } = useSettings()
  const theme = (settings.theme ?? 'normal') as ThemeKey
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cfg = CFG[theme]
    const canvas = canvasRef.current
    if (!cfg || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = window.innerWidth
    let h = window.innerHeight
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const spawn = (initial: boolean): Particle => ({
      x: cfg.mode === 'fly' ? rand(initial ? -360 : -80, -40) : rand(-20, w + 20),
      y:
        cfg.mode === 'rise'
          ? rand(initial ? h * 0.4 : h + 40, h + 80)
          : cfg.mode === 'fly'
            ? rand(0, h)
            : rand(-60, h),
      size: rand(cfg.size[0], cfg.size[1]),
      v: rand(cfg.speed[0], cfg.speed[1]),
      phase: rand(0, Math.PI * 2),
      sway: rand(8, 26),
      rot: rand(-0.25, 0.25),
      vr: rand(-0.012, 0.012),
    })

    const particles: Particle[] = Array.from({ length: cfg.count }, () => spawn(true))

    let raf = 0
    let last = performance.now()
    let running = true
    let frame = 0

    const loop = (now: number) => {
      const dt = Math.min(34, now - last) / 16.667
      last = now
      frame++
      const boost = cfg.boost && frame < 110 ? 1 + (1 - frame / 110) * cfg.boost : 1

      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = cfg.opacity
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (const p of particles) {
        p.phase += 0.02 * dt * boost
        if (cfg.mode === 'fall') {
          p.y += p.v * dt
          p.x += Math.sin(p.phase) * 0.6 * dt
          if (p.y > h + 40) {
            p.y = -40
            p.x = rand(-20, w + 20)
          }
        } else if (cfg.mode === 'rise') {
          p.y -= p.v * dt
          p.x += Math.sin(p.phase) * 0.5 * dt
          if (p.y < -40) {
            p.y = h + 40
            p.x = rand(-20, w + 20)
          }
        } else {
          p.x += p.v * dt * boost
          p.y += Math.sin(p.phase) * 0.9 * dt
          if (p.x > w + 60) {
            p.x = -80
            p.y = rand(0, h)
          }
        }

        if (cfg.shape === 'circle') {
          ctx.fillStyle = cfg.color ?? '#ffffff'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.font = `${p.size}px serif`
          ctx.fillText(cfg.emoji ?? '❄️', 0, 0)
          ctx.restore()
        }
      }

      if (running) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onVis = () => {
      running = !document.hidden
      if (running) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [theme])

  if (!CFG[theme]) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35]"
    />
  )
}
