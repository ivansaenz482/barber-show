import { useEffect, useMemo, useState } from 'react'
import type { ElementType, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Cake,
  Check,
  ClipboardList,
  DollarSign,
  Eye,
  EyeOff,
  Gift,
  Image as ImageIcon,
  Layers,
  Lock,
  Plus,
  QrCode,
  RotateCcw,
  Save,
  Scissors,
  Settings as SettingsIcon,
  ShoppingBag,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useSettings } from '../context/settings-context'
import { useData } from '../context/data-context'
import {
  defaultSettings,
  type HoursEntry,
  type SiteSettings,
  type SocialLink,
} from '../data/settings'
import type { Category, Client, GalleryImage, Plan, Product, ProductCategory, Promotion } from '../lib/types'
import { socialIcon } from '../lib/social-icons'

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onerror = () => resolve('')
    reader.onload = () => {
      const original = String(reader.result)
      const img = new Image()
      img.onerror = () => resolve(original)
      img.onload = () => {
        const MAX = 1280
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        if (scale === 1) return resolve(original)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(original)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        try {
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        } catch {
          resolve(original)
        }
      }
      img.src = original
    }
    reader.readAsDataURL(file)
  })
}

const inputCls =
  'w-full rounded-xl border border-primary/20 bg-surface px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none'

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
        className={inputCls}
      />
    </div>
  )
}

function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string; icon: ElementType }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            active === t.key
              ? 'bg-gradient-to-r from-primary to-accent text-background'
              : 'border border-primary/25 text-slate-300 hover:border-primary/60 hover:text-primary-light'
          }`}
        >
          <t.icon size={14} />
          {t.label}
        </button>
      ))}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  icon: ElementType
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${accent}`}>
          <Icon size={20} />
        </span>
        <div>
          <p className="font-display text-2xl font-extrabold text-white">{value}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

function ImageInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const readFile = async (file: File) => {
    onChange(await compressImage(file))
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
        Foto
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt="Vista previa"
            className="h-14 w-20 shrink-0 rounded-lg border border-primary/20 object-cover"
          />
        ) : (
          <span className="grid h-14 w-20 shrink-0 place-items-center rounded-lg border border-dashed border-primary/30 text-slate-500">
            <ImageIcon size={20} />
          </span>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/30 px-4 py-2.5 text-xs font-bold text-primary-light transition-colors hover:bg-primary/10">
          Subir foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) readFile(f)
            }}
          />
        </label>
      </div>
      <input
        type="url"
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="...o pega una URL de imagen"
        className={inputCls}
      />
    </div>
  )
}

const tabs = [
  { key: 'stats', label: 'Estadísticas', icon: BarChart3 },
  { key: 'barbers', label: 'Barberos', icon: UserRound },
  { key: 'services', label: 'Servicios', icon: Scissors },
  { key: 'products', label: 'Productos', icon: ShoppingBag },
  { key: 'promotions', label: 'Promociones', icon: Gift },
  { key: 'plans', label: 'Planes', icon: Layers },
  { key: 'gallery', label: 'Galería', icon: ImageIcon },
  { key: 'clients', label: 'Clientes', icon: Users },
  { key: 'orders', label: 'Pedidos', icon: ClipboardList },
  { key: 'qr', label: 'QR de registro', icon: QrCode },
  { key: 'settings', label: 'Ajustes', icon: SettingsIcon },
]

export default function AdminPanel() {
  const { settings, updateSettings, resetSettings, adminPassword, changeAdminPassword } =
    useSettings()
  const { cloud } = useData()
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState('stats')

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#admin') {
        setOpen(true)
      }
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const close = () => {
    setOpen(false)
    setAuthed(false)
    setPassword('')
    setError(false)
    setTab('stats')
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const login = () => {
    if (password === adminPassword) {
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

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
            className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-primary/15 bg-surface px-6 py-4">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-primary-light" />
                <h2 className="font-display text-lg font-bold text-white">
                  Panel de Administración
                </h2>
                <span
                  className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    cloud
                      ? 'bg-primary/15 text-primary-light'
                      : 'bg-gold/15 text-gold'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cloud ? 'bg-primary-light' : 'bg-gold'}`} />
                  {cloud ? 'Conectado a Firebase' : 'Modo demo (local)'}
                </span>
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
                    Contraseña por defecto: exclusive123 (cámbiala en el panel → Ajustes → Seguridad)
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-6 py-6">
                <Tabs tabs={tabs} active={tab} onChange={setTab} />

                <div className="mt-6">
                  {tab === 'stats' && <StatsTab />}
                  {tab === 'barbers' && <BarbersTab />}
                  {tab === 'services' && <ServicesTab />}
                  {tab === 'products' && <ProductsTab />}
                  {tab === 'promotions' && <PromotionsTab />}
                  {tab === 'plans' && <PlansTab />}
                  {tab === 'gallery' && <GalleryTab />}
                  {tab === 'clients' && <ClientsTab />}
                  {tab === 'orders' && <OrdersTab />}
                  {tab === 'qr' && <QrTab />}
                  {tab === 'settings' && (
                    <SettingsTab
                      settings={settings}
                      updateSettings={updateSettings}
                      resetSettings={resetSettings}
                      adminPassword={adminPassword}
                      changeAdminPassword={changeAdminPassword}
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatsTab() {
  const { stats, clients, orders, appointments, visits, barbers } = useData()

  const cutsRevenue = useMemo(
    () => appointments.reduce((sum, a) => sum + (Number(a.price) || 0), 0),
    [appointments],
  )

  const storeRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [orders],
  )

  const totalRevenue = cutsRevenue + storeRevenue

  const barberStats = useMemo(
    () =>
      barbers.map((b) => {
        const cuts = appointments.filter((a) => a.barberId === b.id)
        return {
          name: b.name,
          cuts: cuts.length,
          revenue: cuts.reduce((sum, a) => sum + (Number(a.price) || 0), 0),
        }
      }),
    [barbers, appointments],
  )

  const bestSellers = useMemo(() => {
    const agg: Record<string, number> = {}
    orders.forEach((o) =>
      o.items.forEach((i) => {
        agg[i.name] = (agg[i.name] || 0) + i.qty
      }),
    )
    return Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [orders])

  const birthdayToday = useMemo(() => {
    const now = new Date()
    return clients.filter((c) => {
      const [y, m, d] = (c.birthDate || '').split('-').map(Number)
      return y && m && d && now.getMonth() + 1 === m && now.getDate() === d
    })
  }, [clients])

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitas" value={stats.visits} icon={Users} accent="bg-primary/20 text-primary-light" />
        <StatCard label="Cortes realizados" value={stats.haircuts} icon={Scissors} accent="bg-accent/20 text-accent" />
        <StatCard label="Clientes" value={clients.length} icon={UserCheck} accent="bg-primary/20 text-primary-light" />
        <StatCard label="Pedidos" value={orders.length} icon={ShoppingBag} accent="bg-gold/20 text-gold" />
      </div>

      <div className="rounded-2xl border border-primary/15 bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            Ingresos
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-extrabold text-white">
              ${cutsRevenue.toFixed(2)}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Por cortes
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-white">
              ${storeRevenue.toFixed(2)}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Por tienda
            </p>
          </div>
          <div className="rounded-xl bg-gold/15 px-4 py-2">
            <p className="font-display text-2xl font-extrabold text-gold">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ingresos totales
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-primary/15 bg-surface p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-light">
            Rendimiento por barbero
          </h3>
          <ul className="flex flex-col gap-2">
            {barberStats.map((b) => (
              <li key={b.name} className="rounded-xl border border-primary/10 bg-card px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">{b.name}</span>
                  <span className="font-bold text-gold">${b.revenue.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{b.cuts} cortes realizados</span>
                  <span>{b.cuts === 0 ? '—' : `$${(b.revenue / b.cuts).toFixed(2)} por corte`}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-primary/15 bg-surface p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-light">
              Productos más vendidos
            </h3>
            {bestSellers.length === 0 ? (
              <p className="text-sm text-slate-400">Aún no hay ventas registradas.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {bestSellers.map(([name, qty], i) => (
                  <li key={name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      {i + 1}. {name}
                    </span>
                    <span className="font-bold text-gold">{qty} u.</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-primary/15 bg-surface p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-light">
              Próximas citas
            </h3>
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400">No hay citas reservadas.</p>
            ) : (
              <ul className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                {[...appointments].reverse().map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-slate-300">
                      {a.clientName} — <span className="text-white">{a.serviceName}</span>
                      {a.barberName ? ` · ${a.barberName}` : ''}
                    </span>
                    <span className="shrink-0 font-bold text-primary-light">
                      {new Date(a.date + 'T00:00:00').toLocaleDateString('es', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
        <div className="flex items-center gap-2">
          <Cake size={18} className="text-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
            Cumpleañeros de hoy (corte gratis)
          </h3>
        </div>
        {birthdayToday.length === 0 ? (
          <p className="mt-2 text-sm text-slate-300">Ningún cliente cumple años hoy.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {birthdayToday.map((c) => (
              <li key={c.id} className="text-sm font-semibold text-white">
                {c.name} — {c.phone}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Actividad reciente: {visits.filter((v) => v.type === 'visit').length} visitas registradas en el
        registro de actividad.
      </p>
    </div>
  )
}

function BarbersTab() {
  const { barbers, addBarber, updateBarber, deleteBarber } = useData()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return
    await addBarber(name)
    setName('')
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={submit}
        className="grid gap-4 rounded-2xl border border-primary/15 bg-surface p-5 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <Field label="Nombre del barbero" value={name} onChange={setName} />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 font-bold text-background"
        >
          <Plus size={16} />
          Agregar
        </button>
      </form>

      <p className="text-xs text-slate-500">
        Los clientes eligen a su barbero al reservar una cita. El panel calcula los cortes e
        ingresos de cada uno.
      </p>

      <ul className="flex flex-col gap-2">
        {barbers.map((b) => (
          <li key={b.id} className="rounded-xl border border-primary/15 bg-surface p-3">
            {editing === b.id ? (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputCls}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateBarber(b.id, editName)
                      setEditing(null)
                    }}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-r from-primary to-accent text-background"
                    aria-label="Guardar"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-primary/25 text-slate-300"
                    aria-label="Cancelar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary-light">
                    <UserRound size={18} />
                  </span>
                  <p className="font-semibold text-white">{b.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(b.id)
                      setEditName(b.name)
                    }}
                    className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
                  >
                    Editar nombre
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBarber(b.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ServicesTab() {
  const { services, addService, updateService, deleteService } = useData()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || !price.trim()) return
    await addService(name, price)
    setName('')
    setPrice('')
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-primary/15 bg-surface p-5 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <Field label="Nombre" value={name} onChange={setName} />
        <Field label="Precio ($)" value={price} onChange={setPrice} />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 font-bold text-background"
        >
          <Plus size={16} />
          Agregar
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {services.map((s) => (
          <li key={s.id} className="rounded-xl border border-primary/15 bg-surface p-3">
            {editing === s.id ? (
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-center">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
                <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className={inputCls} />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateService(s.id, editName, editPrice)
                      setEditing(null)
                    }}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-r from-primary to-accent text-background"
                    aria-label="Guardar"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-primary/25 text-slate-300"
                    aria-label="Cancelar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="text-sm font-bold text-gold">${s.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(s.id)
                      setEditName(s.name)
                      setEditPrice(s.price)
                    }}
                    className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService(s.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct } = useData()
  const empty: Omit<Product, 'id'> = {
    name: '',
    category: 'ropa',
    price: '',
    image: '',
    description: '',
  }
  const [form, setForm] = useState<Omit<Product, 'id'>>(empty)
  const [editingId, setEditingId] = useState<string | null>(null)

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      description: p.description,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(empty)
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) return
    if (editingId) {
      await updateProduct(editingId, { ...form, image: form.image || '' })
      cancelEdit()
    } else {
      await addProduct({ ...form, image: form.image || '' })
      setForm(empty)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            {editingId ? 'Editar producto' : 'Agregar producto'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/10"
            >
              Cancelar edición
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Categoría
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
              className={inputCls}
            >
              <option value="ropa">Ropa</option>
              <option value="perfume">Perfume</option>
              <option value="accesorio">Accesorio</option>
            </select>
          </div>
          <Field label="Precio ($)" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Descripción
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageInput value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-bold text-background"
        >
          <Save size={16} />
          {editingId ? 'Guardar cambios' : 'Agregar producto'}
        </button>
      </form>

      <ul className="grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl border border-primary/15 bg-surface p-3">
            <img
              src={p.image}
              alt={p.name}
              className="h-14 w-16 shrink-0 rounded-lg border border-primary/20 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{p.name}</p>
              <p className="text-xs uppercase text-slate-400">{p.category}</p>
              <p className="text-sm font-bold text-gold">${p.price}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => deleteProduct(p.id)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                aria-label="Eliminar"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PromotionsTab() {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useData()
  const empty: Omit<Promotion, 'id'> = { title: '', description: '', image: '' }
  const [form, setForm] = useState<Omit<Promotion, 'id'>>(empty)
  const [editingId, setEditingId] = useState<string | null>(null)

  const startEdit = (p: Promotion) => {
    setEditingId(p.id)
    setForm({ title: p.title, description: p.description, image: p.image })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(empty)
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const data = { ...form, description: form.description.trim(), image: form.image }
    if (editingId) {
      await updatePromotion(editingId, data)
      cancelEdit()
    } else {
      await addPromotion(data)
      setForm(empty)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            {editingId ? 'Editar promoción' : 'Agregar promoción'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/10"
            >
              Cancelar edición
            </button>
          )}
        </div>
        <div className="grid gap-4">
          <Field label="Título" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className={inputCls + ' resize-none'}
            />
          </div>
          <ImageInput value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-bold text-background"
        >
          <Save size={16} />
          {editingId ? 'Guardar cambios' : 'Agregar promoción'}
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {promotions.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl border border-primary/15 bg-surface p-3">
            {p.image ? (
              <img src={p.image} alt={p.title} className="h-14 w-20 shrink-0 rounded-lg border border-primary/20 object-cover" />
            ) : (
              <span className="grid h-14 w-20 shrink-0 place-items-center rounded-lg border border-dashed border-primary/30 text-slate-500">
                <Gift size={20} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{p.title}</p>
              <p className="line-clamp-2 text-xs text-slate-400">{p.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => deletePromotion(p.id)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                aria-label="Eliminar"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GalleryTab() {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useData()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('cortes')
  const [image, setImage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const startEdit = (g: GalleryImage) => {
    setEditingId(g.id)
    setTitle(g.title)
    setCategory(g.category)
    setImage(g.src)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setCategory('cortes')
    setImage('')
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!image || !title.trim()) return
    setBusy(true)
    try {
      const data = { title: title.trim(), category, src: image }
      if (editingId) await updateGalleryImage(editingId, data)
      else await addGalleryImage(data)
      cancelEdit()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            {editingId ? 'Editar foto' : 'Agregar foto'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/10"
            >
              Cancelar edición
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" value={title} onChange={setTitle} />
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={inputCls}
            >
              <option value="barberia">La Barbería</option>
              <option value="cortes">Cortes</option>
              <option value="adultos">Adultos</option>
              <option value="jovenes">Jóvenes</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <ImageInput value={image} onChange={setImage} />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy || !image || !title.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-bold text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={16} />
          {editingId ? 'Guardar cambios' : 'Agregar foto'}
        </button>
      </form>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gallery.map((g) => (
          <li key={g.id} className="group relative overflow-hidden rounded-xl border border-primary/15 bg-surface">
            <img
              src={g.src}
              alt={g.title}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(g)}
                  className="rounded-lg border border-primary/40 bg-black/60 px-2.5 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/20"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deleteGalleryImage(g.id)}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-red-400/40 bg-black/60 text-red-400 hover:bg-red-400/20"
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div>
                <p className="truncate text-xs font-semibold text-white">{g.title}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-300">{g.category}</p>
              </div>
            </div>
          </li>
        ))}
        {gallery.length === 0 && (
          <li className="col-span-full rounded-xl border border-dashed border-primary/25 p-6 text-center text-sm text-slate-400">
            No hay fotos todavía. Agrega la primera arriba.
          </li>
        )}
      </ul>
    </div>
  )
}

function PlansTab() {
  const { plans, addPlan, updatePlan, deletePlan } = useData()
  const empty: Omit<Plan, 'id'> = {
    name: '',
    price: '',
    description: '',
    features: [],
    featured: false,
  }
  const [form, setForm] = useState<Omit<Plan, 'id'>>(empty)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [featuresText, setFeaturesText] = useState('')

  const startEdit = (p: Plan) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      features: p.features,
      featured: p.featured,
    })
    setFeaturesText(p.features.join('\n'))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(empty)
    setFeaturesText('')
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) return
    const data = {
      ...form,
      features: featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    }
    if (editingId) {
      await updatePlan(editingId, data)
      cancelEdit()
    } else {
      await addPlan(data)
      setForm(empty)
      setFeaturesText('')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            {editingId ? 'Editar plan' : 'Agregar plan'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/10"
            >
              Cancelar edición
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del plan" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <Field label="Precio (ej: $12)" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
          <div className="sm:col-span-2">
            <Field
              label="Descripción"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Beneficios (uno por línea)
            </label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={4}
              placeholder={'Corte clásico a máquina y tijera\nLavado\nPerfilado de contorno'}
              className={inputCls + ' resize-none'}
            />
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-slate-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-5 w-5 accent-primary"
            />
            Marcar como plan destacado ("Más popular")
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-bold text-background"
        >
          <Save size={16} />
          {editingId ? 'Guardar cambios' : 'Agregar plan'}
        </button>
      </form>

      <ul className="grid gap-3 sm:grid-cols-2">
        {plans.map((p) => (
          <li key={p.id} className="rounded-xl border border-primary/15 bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-white">{p.name}</p>
                  {p.featured && (
                    <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                      Destacado
                    </span>
                  )}
                </div>
                <p className="mt-1 font-display text-xl font-extrabold text-gold">{p.price}</p>
                <p className="mt-1 text-xs text-slate-400">{p.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deletePlan(p.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                  aria-label="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <ul className="mt-3 flex flex-col gap-1 border-t border-primary/10 pt-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check size={12} className="mt-0.5 shrink-0 text-primary-light" />
                  {f}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ClientsTab() {
  const { clients, updateClientById, deleteClient } = useData()
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cedula: '',
    birthDate: '',
  })

  const startEdit = (c: Client) => {
    setEditing(c.id)
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      cedula: c.cedula || '',
      birthDate: c.birthDate || '',
    })
  }

  const cancelEdit = () => setEditing(null)

  return (
    <div className="flex flex-col gap-3">
      {clients.length === 0 ? (
        <p className="rounded-xl border border-dashed border-primary/30 px-4 py-8 text-center text-sm text-slate-400">
          Aún no hay clientes registrados.
        </p>
      ) : (
        <ul className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
          {clients.map((c) => (
            <li key={c.id} className="rounded-xl border border-primary/15 bg-surface p-4">
              {editing === c.id ? (
                <div className="flex flex-col gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nombre" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                    <Field label="Celular" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
                    <Field label="Gmail" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
                    <Field label="Cédula" value={form.cedula} onChange={(v) => setForm((f) => ({ ...f, cedula: v }))} />
                    <Field label="Fecha de nacimiento" value={form.birthDate} onChange={(v) => setForm((f) => ({ ...f, birthDate: v }))} type="date" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!form.name.trim() || !form.phone.trim()) return
                        await updateClientById(c.id, form)
                        setEditing(null)
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-bold text-background"
                    >
                      <Save size={15} />
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-full border border-primary/30 px-5 py-2 text-sm font-bold text-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="text-sm text-slate-400">{c.phone}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar a ${c.name}? Esta acción no se puede deshacer.`)) {
                            deleteClient(c.id)
                          }
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-slate-400 sm:grid-cols-3">
                    <p>
                      <span className="font-semibold text-slate-300">Cédula:</span> {c.cedula || '—'}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-300">Cumpleaños:</span> {c.birthDate || '—'}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-300">Gmail:</span> {c.email || '—'}
                    </p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function OrdersTab() {
  const { orders } = useData()
  return (
    <div className="flex flex-col gap-3">
      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-primary/30 px-4 py-8 text-center text-sm text-slate-400">
          Aún no hay pedidos registrados.
        </p>
      ) : (
        <ul className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
          {[...orders].reverse().map((o) => (
            <li key={o.id} className="rounded-xl border border-primary/15 bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{o.clientName}</p>
                <p className="text-sm font-bold text-gold">${o.total}</p>
              </div>
              <p className="text-xs text-slate-500">
                {new Date(o.createdAt).toLocaleString('es')}
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-xs text-slate-400">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    • {i.name} x{i.qty} — ${(Number(i.price) * i.qty).toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function QrTab() {
  const siteUrl = `${window.location.origin}${window.location.pathname}`.replace(
    /index\.html$/,
    '',
  )
  const [copied, setCopied] = useState(false)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&qzone=2&data=${encodeURIComponent(siteUrl)}`

  const copy = () => {
    navigator.clipboard?.writeText(siteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-primary/15 bg-surface p-6 text-center">
      <p className="max-w-md text-sm text-slate-300">
        Imprime este código y colócalo en la barbería. Al escanearlo, tus clientes llegan directo al
        formulario de registro de Exclusive.
      </p>
      <img src={qrUrl} alt="Código QR de registro" className="rounded-2xl border border-primary/25 bg-white p-3" width={280} height={280} />
      <p className="max-w-md break-all text-xs text-slate-400">{siteUrl}</p>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-2.5 text-sm font-bold text-primary-light transition-colors hover:bg-primary/10"
      >
        {copied ? '¡Copiado!' : 'Copiar enlace del QR'}
      </button>
      <p className="max-w-md text-xs text-slate-500">
        Consejo: usa el WhatsApp Business para entregar el QR digital a tus clientes frecuentes.
      </p>
    </div>
  )
}

function SettingsTab({
  settings,
  updateSettings,
  resetSettings,
  adminPassword,
  changeAdminPassword,
}: {
  settings: SiteSettings
  updateSettings: (next: SiteSettings) => void
  resetSettings: () => void
  adminPassword: string
  changeAdminPassword: (password: string) => Promise<void>
}) {
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [saved, setSaved] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passError, setPassError] = useState('')
  const [passSaved, setPassSaved] = useState(false)
  const [showPassFields, setShowPassFields] = useState(false)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

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
      socials: [...d.socials, { id: `social-${Date.now()}`, label: 'Nueva red', url: 'https://' }],
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

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Celular" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} />
        <Field label="Correo electrónico" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} />
        <Field label="Dirección" value={draft.address} onChange={(v) => setDraft((d) => ({ ...d, address: v }))} />
        <Field label="WhatsApp (enlace wa.me)" value={draft.whatsapp} onChange={(v) => setDraft((d) => ({ ...d, whatsapp: v }))} />
        <div className="sm:col-span-2">
          <Field label="Google Maps (enlace del mapa)" value={draft.mapEmbed} onChange={(v) => setDraft((d) => ({ ...d, mapEmbed: v }))} />
          <p className="mt-1.5 text-xs text-slate-500">
            Cómo obtenerlo: en Google Maps busca tu barbería → Compartir → Insertar un mapa → copia el enlace del iframe (la parte después de src="..."). También sirve uno así: https://www.google.com/maps?q=Guayaquil%2C%20Ecuador&output=embed
          </p>
        </div>
      </div>

      <h3 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-primary-light">
        Redes sociales
      </h3>
      <div className="flex flex-col gap-3">
        {draft.socials.map((s) => {
          const Icon = socialIcon(s)
          return (
            <div key={s.id} className="grid gap-3 rounded-xl border border-primary/15 bg-surface p-3 sm:grid-cols-[auto_1fr_2fr_auto] sm:items-center">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary-light">
                <Icon size={18} />
              </span>
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
          )
        })}
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

      <div className="mt-8 rounded-2xl border border-primary/15 bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
              Seguridad
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Cambia la contraseña de acceso al panel de administración.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPassFields((v) => !v)
              setPassError('')
            }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-xs font-bold text-primary-light transition-colors hover:bg-primary/10"
          >
            <Lock size={14} />
            {showPassFields ? 'Cancelar' : 'Cambiar contraseña'}
          </button>
        </div>

        {showPassFields && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field
              label="Contraseña actual"
              value={currentPass}
              onChange={setCurrentPass}
              type="password"
            />
            <Field label="Nueva contraseña" value={newPass} onChange={setNewPass} type="password" />
            <Field
              label="Repetir nueva contraseña"
              value={confirmPass}
              onChange={setConfirmPass}
              type="password"
            />
            <div className="sm:col-span-3">
              {passError && (
                <p className="mb-2 text-xs font-semibold text-red-400">{passError}</p>
              )}
              {passSaved && (
                <p className="mb-2 text-xs font-semibold text-primary-light">
                  Contraseña actualizada correctamente.
                </p>
              )}
              <button
                type="button"
                onClick={async () => {
                  setPassError('')
                  setPassSaved(false)
                  if (currentPass !== adminPassword) {
                    setPassError('La contraseña actual no es correcta.')
                    return
                  }
                  if (newPass.length < 6) {
                    setPassError('La nueva contraseña debe tener al menos 6 caracteres.')
                    return
                  }
                  if (newPass !== confirmPass) {
                    setPassError('Las contraseñas nuevas no coinciden.')
                    return
                  }
                  await changeAdminPassword(newPass)
                  setCurrentPass('')
                  setNewPass('')
                  setConfirmPass('')
                  setPassSaved(true)
                  setTimeout(() => setShowPassFields(false), 1200)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-bold text-background"
              >
                <Save size={16} />
                Guardar contraseña
              </button>
            </div>
          </div>
        )}
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
  )
}

