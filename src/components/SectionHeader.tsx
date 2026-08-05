import { motion } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="mx-auto mb-14 max-w-2xl text-center"
    >
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-light">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-slate-300">{subtitle}</p>}
      <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-accent" />
    </motion.div>
  )
}
