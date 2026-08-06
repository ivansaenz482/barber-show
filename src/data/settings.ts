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

export interface SiteSettings {
  phone: string
  email: string
  address: string
  whatsapp: string
  socials: SocialLink[]
  hours: HoursEntry[]
}

export const ADMIN_PASSWORD = 'exclusive123'
export const ADMIN_PASSWORD_KEY = 'exclusive-admin-password'

export const defaultSettings: SiteSettings = {
  phone: '+1 555 123 4567',
  email: 'hola@exclusivebarbershow.com',
  address: 'Av. Principal 123, Centro',
  whatsapp: 'https://wa.me/15551234567',
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
}

export const STORAGE_KEY = 'exclusive-settings'
