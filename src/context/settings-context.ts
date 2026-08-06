import { createContext, useContext } from 'react'
import type { SiteSettings } from '../data/settings'

export interface SettingsContextValue {
  settings: SiteSettings
  updateSettings: (next: SiteSettings) => void
  resetSettings: () => void
  adminPassword: string
  changeAdminPassword: (password: string) => Promise<void>
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de SettingsProvider')
  return ctx
}
