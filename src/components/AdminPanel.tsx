import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { useSettings } from '../context/settings-context'
import { ADMIN_PASSWORD, defaultSettings, type HoursEntry, type SiteSettings, type SocialLink } from '../data/settings'

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-primary/20 bg-surface px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
      />
    </div>
  )
}

export default function AdminPanel() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === '#admin')
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (open) setDraft(settings)
  }, [open, settings])

  const close = () => {
    setOpen(false)
    setAuthed(false)
    setPassword('')
    setError(false)
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const save = () => {
    updateSettings(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const setSocial = (id: string, patch: Partial<SocialLink>) => {
    setDraft((d) => ({
      ...d,
      socials: d.socials.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  const removeSocial = (id: string) => {
    setDraft((d) => ({ ...d, socials: d.socials.filter((s) => s.id !== id) }))
  }

  const addSocial = () => {
    setDraft((d) => ({
      ...d,
      socials: [
        ...d.socials,
        { id: `social-${Date.now()}`, label: 'Nueva red', url: 'https://' },
      ],
    }))
  }

  const setHour = (id: string, patch: Partial<HoursEntry>) => {
    setDraft((d) => ({
      ...d,
      hours: d.hours.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }))
  }

  const removeHour = (id: string) => {
    setDraft((d) => ({ ...d, hours: d.hours.filter((h) => h.id !== id) }))
  }

  const addHour = () => {
    setDraft((d) => ({
      ...d,
      hours: [...d.hours, { id: `hour-${Date.now()}`, day: 'Nuevo día', time: '9:00 – 18:00' }],
    }))
  }

  const inputCls =
    'w-full rounded-xl border border-primary/20 bg-surface px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
        >
          <motion.div
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-primary/15 bg-surface px-6 py-4">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-primary-light" />
                <h2 className="font-display text-lg font-bold text-white">
                  Panel de Administración
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-lg border border-primary/20 text-slate-300 transition-colors hover:bg-primary/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {!authed ? (
              <div className="px-6 py-10">
                <p className="mb-6 text-center text-sm text-slate-400">
                  Ingresa la contraseña de administrador para editar el sitio.
                </p>
                <div className="mx-auto max-w-sm">
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError(false)
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && login()}
                      placeholder="Contraseña"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label="Mostrar contraseña"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-light"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-center text-xs font-semibold text-red-400">
                      Contraseña incorrecta.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={login}
                    className="mt-5 w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-bold text-background"
                  >
                    Entrar
                  </button>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Contraseña por defecto: exclusive123 (cámbiala en src/data/settings.ts)
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-6 py-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Celular"
                    value={draft.phone}
                    onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
                  />
                  <Field
                    label="Correo electrónico"
                    value={draft.email}
                    onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                  />
                  <Field
                    label="Dirección"
                    value={draft.address}
                    onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
                  />
                  <Field
                    label="WhatsApp (enlace wa.me)"
                    value={draft.whatsapp}
                    onChange={(v) => setDraft((d) => ({ ...d, whatsapp: v }))}
                  />
                </div>

                <h3 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-primary-light">
                  Redes sociales
                </h3>
                <div className="flex flex-col gap-3">
                  {draft.socials.map((s) => (
                    <div key={s.id} className="grid gap-3 rounded-xl border border-primary/15 bg-surface p-3 sm:grid-cols-[1fr_2fr_auto]">
                      <input
                        value={s.label}
                        onChange={(e) => setSocial(s.id, { label: e.target.value })}
                        placeholder="Nombre (ej: Instagram)"
                        className={inputCls}
                      />
                      <input
                        value={s.url}
                        onChange={(e) => setSocial(s.id, { url: e.target.value })}
                        placeholder="https://..."
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => removeSocial(s.id)}
                        aria-label="Eliminar red"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-red-400/30 text-red-400 transition-colors hover:bg-red-400/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocial}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-2.5 text-sm font-semibold text-primary-light transition-colors hover:bg-primary/10"
                  >
                    <Plus size={16} />
                    Agregar red social
                  </button>
                </div>

                <h3 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-primary-light">
                  Horario
                </h3>
                <div className="flex flex-col gap-3">
                  {draft.hours.map((h) => (
                    <div key={h.id} className="grid gap-3 rounded-xl border border-primary/15 bg-surface p-3 sm:grid-cols-[2fr_1fr_auto]">
                      <input
                        value={h.day}
                        onChange={(e) => setHour(h.id, { day: e.target.value })}
                        placeholder="Día"
                        className={inputCls}
                      />
                      <input
                        value={h.time}
                        onChange={(e) => setHour(h.id, { time: e.target.value })}
                        placeholder="Horario"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => removeHour(h.id)}
                        aria-label="Eliminar horario"
                        className="grid h-10 w-10 place-items-center rounded-lg border border-red-400/30 text-red-400 transition-colors hover:bg-red-400/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addHour}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-2.5 text-sm font-semibold text-primary-light transition-colors hover:bg-primary/10"
                  >
                    <Plus size={16} />
                    Agregar horario
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={save}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3 font-bold text-background transition-transform hover:scale-[1.02]"
                  >
                    <Save size={18} />
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(defaultSettings)
                      resetSettings()
                      setSaved(true)
                      setTimeout(() => setSaved(false), 2500)
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 px-5 py-3 font-bold text-primary-light transition-colors hover:bg-primary/10"
                  >
                    <RotateCcw size={16} />
                    Restaurar
                  </button>
                </div>

                <AnimatePresence>
                  {saved && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary-light"
                    >
                      Cambios guardados correctamente.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
