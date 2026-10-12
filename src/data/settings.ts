import type { ThemeKey } from '../lib/themes'

export interface SocialLink {
  id: string
  label: string
  url: string
}

export interface HoursEntry {
  id: string
  day: string
  time: string
}

export interface HappyHourConfig {
  enabled: boolean
  days: number[]
  startHour: number
  endHour: number
  discountPct: number
}

export interface LoyaltyConfig {
  pointsPerCut: number
  pointsPerDollar: number
  signupBonus: number
  referralBonus: number
  referredBonus: number
  happyHour: HappyHourConfig
}

export interface SiteSettings {
  phone: string
  email: string
  address: string
  whatsapp: string
  mapEmbed: string
  mapsLink: string
  socials: SocialLink[]
  hours: HoursEntry[]
  loyalty: LoyaltyConfig
  theme: ThemeKey
}

export const ADMIN_PASSWORD = 'exclusive123'
export const ADMIN_PASSWORD_KEY = 'exclusive-admin-password'

export const defaultSettings: SiteSettings = {
  phone: '+1 555 123 4567',
  email: 'hola@exclusivebarbershow.com',
  address: 'Elena Valle Schenonne, Parroquia Febres Cordero, 090408 Guayaquil, Ecuador',
  whatsapp: 'https://wa.me/15551234567',
  mapEmbed: 'https://www.google.com/maps?q=-2.2166967,-79.9230501&z=17&output=embed',
  mapsLink: 'https://maps.app.goo.gl/JuAqu46FenbZLNXg9',
  socials: [
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/exclusivebarber' },
    { id: 'facebook', label: 'Facebook', url: 'https://facebook.com/exclusivebarber' },
    { id: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@exclusivebarber' },
  ],
  hours: [
    { id: 'h1', day: 'Lunes a Viernes', time: '9:00 – 20:00' },
    { id: 'h2', day: 'Sábado', time: '9:00 – 21:00' },
    { id: 'h3', day: 'Domingo', time: 'Cerrado' },
  ],
  loyalty: {
    pointsPerCut: 10,
    pointsPerDollar: 1,
    signupBonus: 20,
    referralBonus: 30,
    referredBonus: 20,
    happyHour: {
      enabled: false,
      days: [1, 2, 3, 4],
      startHour: 9,
      endHour: 13,
      discountPct: 20,
    },
  },
  theme: 'normal',
}

export const STORAGE_KEY = 'exclusive-settings'

const LEGACY_MAP_EMBEDS = [
  'https://www.google.com/maps?q=Q3MG%2B7QP%20Elena%20Valle%20Schenonne%2C%20090408%20Guayaquil&output=embed',
]
const LEGACY_ADDRESSES = [
  'Calle Q3MG+7QP, Elena Valle Schenonne, 090408 Guayaquil, Ecuador',
]

export function mergeSettings(base: SiteSettings, patch: Partial<SiteSettings>): SiteSettings {
  const merged: SiteSettings = {
    ...base,
    ...patch,
    loyalty: {
      ...base.loyalty,
      ...(patch.loyalty ?? {}),
      happyHour: {
        ...base.loyalty.happyHour,
        ...(patch.loyalty?.happyHour ?? {}),
      },
    },
  }
  if (!merged.mapEmbed || LEGACY_MAP_EMBEDS.includes(merged.mapEmbed)) {
    merged.mapEmbed = base.mapEmbed
  }
  if (!merged.address || LEGACY_ADDRESSES.includes(merged.address)) {
    merged.address = base.address
  }
  return merged
}
