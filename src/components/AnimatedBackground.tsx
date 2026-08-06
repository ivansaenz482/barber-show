import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <motion.div
        className="absolute -left-40 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-primary/20 blur-[120px]"
        animate={{ x: [0, 120, -40, 0], y: [0, 80, -60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-15%] top-[25%] h-[38rem] w-[38rem] rounded-full bg-amber-500/15 blur-[120px]"
        animate={{ x: [0, -100, 60, 0], y: [0, -70, 90, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[20%] h-[36rem] w-[36rem] rounded-full bg-yellow-700/20 blur-[130px]"
        animate={{ x: [0, 80, -90, 0], y: [0, -50, 40, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[10%] h-[24rem] w-[24rem] rounded-full bg-gold/10 blur-[110px]"
        animate={{ x: [0, -60, 70, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.9)_100%)]" />
    </div>
  )
}
