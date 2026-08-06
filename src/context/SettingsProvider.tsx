import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { store } from '../lib/store'
import {
  ADMIN_PASSWORD,
  ADMIN_PASSWORD_KEY,
  defaultSettings,
  STORAGE_KEY,
  type SiteSettings,
} from '../data/settings'
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

function loadPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || ADMIN_PASSWORD
  } catch {
    return ADMIN_PASSWORD
  }
}

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings)
  const [adminPassword, setAdminPassword] = useState<string>(loadPassword)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!store.isCloud()) return
    let cancelled = false
    store.getDoc('settings', 'admin').then((doc) => {
      const pwd = doc?.password
      if (!cancelled && typeof pwd === 'string' && pwd) {
        setAdminPassword(pwd)
        try {
          localStorage.setItem(ADMIN_PASSWORD_KEY, pwd)
        } catch {
          /* ignore */
        }
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const updateSettings = useCallback((next: SiteSettings) => {
    setSettings(next)
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  const changeAdminPassword = useCallback(async (password: string) => {
    setAdminPassword(password)
    try {
      localStorage.setItem(ADMIN_PASSWORD_KEY, password)
    } catch {
      /* ignore */
    }
    if (store.isCloud()) {
      await store.setDoc('settings', 'admin', { password })
    }
  }, [])

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings, adminPassword, changeAdminPassword }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
