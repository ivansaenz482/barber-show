import type { Appointment, AppointmentStatus, Client } from './types'
import type { HappyHourConfig, LoyaltyConfig } from '../data/settings'

export interface ClientLevel {
  key: string
  name: string
  minCuts: number
  emoji: string
  colorClass: string
  perk: string
}

export const LEVELS: ClientLevel[] = [
  { key: 'bronce', name: 'Bronce', minCuts: 0, emoji: '🥉', colorClass: 'text-amber-600', perk: 'Acumula puntos en cada corte' },
  { key: 'plata', name: 'Plata', minCuts: 5, emoji: '🥈', colorClass: 'text-slate-300', perk: '5% de descuento en la tienda' },
  { key: 'oro', name: 'Oro', minCuts: 12, emoji: '🥇', colorClass: 'text-gold', perk: '10% de descuento en cortes y tienda' },
]

export function levelForCuts(cuts: number): ClientLevel {
  let level = LEVELS[0]
  for (const l of LEVELS) if (cuts >= l.minCuts) level = l
  return level
}

export function nextLevel(cuts: number): ClientLevel | null {
  return LEVELS.find((l) => l.minCuts > cuts) ?? null
}

export function cutPoints(price: number, cfg: LoyaltyConfig): number {
  return cfg.pointsPerCut + Math.max(0, Math.floor(price)) * cfg.pointsPerDollar
}

export function isHappyHour(date: string, time: string | undefined, cfg: HappyHourConfig): boolean {
  if (!cfg.enabled || !date) return false
  const d = new Date(date + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return false
  if (!cfg.days.includes(d.getDay())) return false
  const hour = time ? Number(time.split(':')[0]) : cfg.startHour
  return hour >= cfg.startHour && hour < cfg.endHour
}

export function applyDiscount(price: number, pct: number): number {
  return Math.max(0, Math.round(price * (1 - pct / 100) * 100) / 100)
}

export function effectiveStatus(a: Appointment): AppointmentStatus {
  if (a.status) return a.status
  const today = new Date().toISOString().split('T')[0]
  return a.date < today ? 'completada' : 'pendiente'
}

export function clientPoints(client: Client): number {
  return Number(client.points) || 0
}

export const STATUS_META: Record<
  AppointmentStatus,
  { label: string; badge: string }
> = {
  pendiente: { label: 'Pendiente', badge: 'bg-slate-500/20 text-slate-300' },
  confirmada: { label: 'Confirmada', badge: 'bg-primary/20 text-primary-light' },
  completada: { label: 'Completada', badge: 'bg-emerald-500/20 text-emerald-400' },
  ausente: { label: 'Ausente', badge: 'bg-orange-500/20 text-orange-400' },
  cancelada: { label: 'Cancelada', badge: 'bg-red-500/20 text-red-400' },
}

export function toCsv(rows: (string | number)[][]): string {
  return (
    '\uFEFF' +
    rows
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? '')
            return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
          })
          .join(';'),
      )
      .join('\r\n')
  )
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function monthKey(isoDate: string): string {
  return (isoDate || '').slice(0, 7)
}
