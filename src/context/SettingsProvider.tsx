import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { defaultSettings, STORAGE_KEY, type SiteSettings } from '../data/settings'
import { SettingsContext } from './settings-context'

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw) as SiteSettings
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = useCallback((next: SiteSettings) => {
    setSettings(next)
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
