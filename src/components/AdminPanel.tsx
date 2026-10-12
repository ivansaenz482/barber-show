import { useEffect, useMemo, useState } from 'react'
import type { ComponentType, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  BarChart3,
  Cake,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Download,
  DollarSign,
  Eye,
  EyeOff,
  Gift,
  Image as ImageIcon,
  Layers,
  Lock,
  Palette,
  Plus,
  QrCode,
  RotateCcw,
  Save,
  ScanLine,
  Scissors,
  Settings as SettingsIcon,
  ShoppingBag,
  Star,
  Trash2,
  Trophy,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'
import { useSettings } from '../context/settings-context'
import { useData } from '../context/data-context'
import {
  defaultSettings,
  type HoursEntry,
  type SiteSettings,
  type SocialLink,
} from '../data/settings'
import type {
  Appointment,
  Category,
  Client,
  ExpenseCategory,
  GalleryImage,
  Plan,
  Product,
  ProductCategory,
  Promotion,
  Reward,
} from '../lib/types'
import { clientPoints, effectiveStatus, levelForCuts, STATUS_META, downloadCsv } from '../lib/loyalty'
import { THEMES, type ThemeKey } from '../lib/themes'
import { socialIcon } from '../lib/social-icons'

interface BarcodeDetectorLike {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>
}

type IconComponent = ComponentType<{ size?: number; className?: string }>

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
  tabs: { key: string; label: string; icon: IconComponent }[]
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
  icon: IconComponent
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
  { key: 'agenda', label: 'Agenda', icon: CalendarDays },
  { key: 'barbers', label: 'Barberos', icon: UserRound },
  { key: 'services', label: 'Servicios', icon: Scissors },
  { key: 'products', label: 'Productos', icon: ShoppingBag },
  { key: 'promotions', label: 'Promociones', icon: Gift },
  { key: 'plans', label: 'Planes', icon: Layers },
  { key: 'gallery', label: 'Galería', icon: ImageIcon },
  { key: 'clients', label: 'Clientes', icon: Users },
  { key: 'rewards', label: 'Premios', icon: Trophy },
  { key: 'orders', label: 'Pedidos', icon: ClipboardList },
  { key: 'accounting', label: 'Contabilidad', icon: Wallet },
  { key: 'qr', label: 'QR de registro', icon: QrCode },
  { key: 'theme', label: 'Temporada', icon: Palette },
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
  const [tab, setTab] = useState('agenda')

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
    setTab('agenda')
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
                  {tab === 'agenda' && <AgendaTab />}
                  {tab === 'barbers' && <BarbersTab />}
                  {tab === 'services' && <ServicesTab />}
                  {tab === 'products' && <ProductsTab />}
                  {tab === 'promotions' && <PromotionsTab />}
                  {tab === 'plans' && <PlansTab />}
                  {tab === 'gallery' && <GalleryTab />}
                  {tab === 'clients' && <ClientsTab />}
                  {tab === 'rewards' && <RewardsTab />}
                  {tab === 'orders' && <OrdersTab />}
                  {tab === 'accounting' && <AccountingTab />}
                  {tab === 'qr' && <QrTab />}
                  {tab === 'theme' && <ThemeTab />}
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

  const completed = useMemo(
    () => appointments.filter((a) => effectiveStatus(a) === 'completada'),
    [appointments],
  )

  const cutsRevenue = useMemo(
    () => completed.reduce((sum, a) => sum + (Number(a.price) || 0), 0),
    [completed],
  )

  const storeRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [orders],
  )

  const totalRevenue = cutsRevenue + storeRevenue

  const barberStats = useMemo(
    () =>
      barbers
        .map((b) => {
          const cuts = completed.filter((a) => a.barberId === b.id)
          const rated = cuts.filter((a) => a.rating)
          const revenue = cuts.reduce((sum, a) => sum + (Number(a.price) || 0), 0)
          const commission = b.commissionPct ?? 0
          return {
            id: b.id,
            name: b.name,
            cuts: cuts.length,
            revenue,
            commissionPct: commission,
            commission: (revenue * commission) / 100,
            rating: rated.length
              ? rated.reduce((s, a) => s + (a.rating ?? 0), 0) / rated.length
              : 0,
            ratingCount: rated.length,
          }
        })
        .sort((a, b) => b.revenue - a.revenue),
    [barbers, completed],
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
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-light">
            <Trophy size={16} className="text-gold" />
            Ranking de barberos
          </h3>
          <ul className="flex flex-col gap-2">
            {barberStats.map((b, i) => (
              <li key={b.id} className="rounded-xl border border-primary/10 bg-card px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {b.name}
                  </span>
                  <span className="font-bold text-gold">${b.revenue.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span>{b.cuts} cortes</span>
                  <span>
                    Comisión {b.commissionPct}%: ${b.commission.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1 text-gold">
                    <Star size={11} className={b.rating ? 'fill-gold' : ''} />
                    {b.rating ? `${b.rating.toFixed(1)} (${b.ratingCount})` : 'sin reseñas'}
                  </span>
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

function AgendaTab() {
  const {
    appointments,
    services,
    barbers,
    clients,
    bookHaircutAdmin,
    setAppointmentStatus,
    deleteAppointment,
  } = useData()
  const [range, setRange] = useState<'hoy' | 'semana' | 'todas'>('hoy')
  const [showForm, setShowForm] = useState(false)
  const [clientId, setClientId] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [barberId, setBarberId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('')
  const [ok, setOk] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const weekEnd = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().split('T')[0]
  }, [])

  const filtered = useMemo(() => {
    return appointments
      .filter((a) => {
        if (range === 'hoy') return a.date === today
        if (range === 'semana') return a.date >= today && a.date <= weekEnd
        return true
      })
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
  }, [appointments, range, today, weekEnd])

  const grouped = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    filtered.forEach((a) => {
      map[a.date] = map[a.date] ? [...map[a.date], a] : [a]
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!serviceId || !barberId || !date) return
    if (!isNew && !clientId) return
    if (isNew && !newName.trim()) return
    await bookHaircutAdmin({
      clientId: isNew ? undefined : clientId,
      newName: isNew ? newName : undefined,
      newPhone: isNew ? newPhone : undefined,
      serviceId,
      barberId,
      date,
      time,
    })
    setOk('Turno asignado correctamente.')
    setClientId('')
    setNewName('')
    setNewPhone('')
    setServiceId('')
    setBarberId('')
    setTime('')
    setTimeout(() => setOk(''), 3000)
  }

  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['hoy', 'semana', 'todas'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${
                range === r
                  ? 'bg-gradient-to-r from-primary to-accent text-background'
                  : 'border border-primary/25 text-slate-300 hover:border-primary/60'
              }`}
            >
              {r === 'hoy' ? 'Hoy' : r === 'semana' ? 'Esta semana' : 'Todas'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-bold text-background"
        >
          <UserPlus size={16} />
          Dar turno manual
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="grid gap-4 rounded-2xl border border-primary/20 bg-surface p-5"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            Nuevo turno (para clientes sin tecnología)
          </h3>
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
            Cliente nuevo (no registrado)
          </label>

          {isNew ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre del cliente" value={newName} onChange={setNewName} />
              <Field label="Celular" value={newPhone} onChange={setNewPhone} />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Cliente registrado
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={inputCls}
              >
                <option value="">Selecciona un cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Servicio
              </label>
              <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputCls}>
                <option value="">Servicio...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ${s.price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Barbero
              </label>
              <select value={barberId} onChange={(e) => setBarberId(e.target.value)} className={inputCls}>
                <option value="">Barbero...</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Fecha" value={date} onChange={setDate} type="date" />
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Hora (opcional)
              </label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-bold text-background"
          >
            <CalendarDays size={16} />
            Asignar turno
          </button>
          {ok && (
            <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary-light">
              {ok}
            </p>
          )}
        </form>
      )}

      {grouped.length === 0 ? (
        <p className="rounded-xl border border-dashed border-primary/30 px-4 py-8 text-center text-sm text-slate-400">
          No hay citas para este rango.
        </p>
      ) : (
        grouped.map(([day, items]) => (
          <div key={day} className="rounded-2xl border border-primary/15 bg-surface p-4">
            <p className="mb-3 text-sm font-bold capitalize text-primary-light">{fmtDate(day)}</p>
            <ul className="flex flex-col gap-2">
              {items.map((a) => {
                const status = effectiveStatus(a)
                const meta = STATUS_META[status]
                return (
                  <li key={a.id} className="rounded-xl border border-primary/10 bg-card px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">
                          {a.time ? `${a.time} · ` : ''}
                          {a.clientName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {a.serviceName} · ${a.price}
                          {a.barberName ? ` · ${a.barberName}` : ''}
                          {a.clientName && clients.find((c) => c.id === a.clientId)?.phone
                            ? ` · ${clients.find((c) => c.id === a.clientId)?.phone}`
                            : ''}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {status !== 'completada' && (
                        <button
                          type="button"
                          onClick={() => setAppointmentStatus(a.id, 'completada')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30"
                        >
                          <CheckCircle2 size={13} />
                          Completar y sumar puntos
                        </button>
                      )}
                      {status === 'pendiente' && (
                        <button
                          type="button"
                          onClick={() => setAppointmentStatus(a.id, 'confirmada')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/30"
                        >
                          <BadgeCheck size={13} />
                          Confirmar
                        </button>
                      )}
                      {status !== 'ausente' && status !== 'completada' && (
                        <button
                          type="button"
                          onClick={() => setAppointmentStatus(a.id, 'ausente')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-500/30"
                        >
                          <XCircle size={13} />
                          No asistió
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta cita?')) deleteAppointment(a.id)
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 size={13} />
                        Eliminar
                      </button>
                      {status === 'completada' && (
                        <span className="text-xs text-slate-400">
                          {a.pointsEarned ? `+${a.pointsEarned} pts` : ''}
                          {a.rating ? ` · ${'★'.repeat(a.rating)}` : ''}
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}

function RewardsTab() {
  const { rewards, addReward, updateReward, deleteReward } = useData()
  const empty = { name: '', description: '', pointsCost: 50, active: true }
  const [form, setForm] = useState<Omit<Reward, 'id'>>(empty)
  const [editingId, setEditingId] = useState<string | null>(null)

  const startEdit = (r: Reward) => {
    setEditingId(r.id)
    setForm({ name: r.name, description: r.description, pointsCost: r.pointsCost, active: r.active })
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editingId) {
      await updateReward(editingId, form)
      setEditingId(null)
    } else {
      await addReward(form)
    }
    setForm(empty)
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-surface p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
          {editingId ? 'Editar premio' : 'Agregar premio canjeable'}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del premio" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <Field
            label="Costo en puntos"
            value={String(form.pointsCost)}
            onChange={(v) => setForm((f) => ({ ...f, pointsCost: Math.max(0, Number(v) || 0) }))}
            type="number"
          />
          <div className="sm:col-span-2">
            <Field
              label="Descripción"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            />
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="h-5 w-5 accent-primary"
          />
          Disponible para canje
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-bold text-background"
          >
            <Save size={16} />
            {editingId ? 'Guardar cambios' : 'Agregar premio'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(empty)
              }}
              className="rounded-full border border-primary/30 px-6 py-3 font-bold text-slate-300"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <ul className="flex flex-col gap-2">
        {rewards.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-surface p-4">
            <div className="min-w-0">
              <p className="font-semibold text-white">
                {r.name}{' '}
                {!r.active && (
                  <span className="ml-1 rounded-full bg-slate-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                    Inactivo
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-400">{r.description}</p>
              <p className="mt-0.5 text-xs font-bold text-gold">{r.pointsCost} pts</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => startEdit(r)}
                className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => deleteReward(r.id)}
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

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'alquiler',
  'insumos',
  'servicios',
  'sueldos',
  'equipos',
  'otros',
]

function AccountingTab() {
  const { appointments, orders, expenses, barbers, addExpense, updateExpense, deleteExpense } = useData()
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const empty = { concept: '', category: 'insumos' as ExpenseCategory, amount: '', date: new Date().toISOString().split('T')[0], notes: '' }
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState<string | null>(null)

  const monthData = useMemo(() => {
    const completed = appointments.filter(
      (a) => effectiveStatus(a) === 'completada' && a.date.slice(0, 7) === month,
    )
    const cutsRevenue = completed.reduce((s, a) => s + (Number(a.price) || 0), 0)
    const monthOrders = orders.filter((o) => (o.createdAt || '').slice(0, 7) === month)
    const storeRevenue = monthOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)
    const monthExpenses = expenses.filter((e) => (e.date || '').slice(0, 7) === month)
    const expenseTotal = monthExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
    const byCategory: Record<string, number> = {}
    monthExpenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + (Number(e.amount) || 0)
    })
    const barberPay = barbers
      .map((b) => {
        const cuts = completed.filter((a) => a.barberId === b.id)
        const revenue = cuts.reduce((s, a) => s + (Number(a.price) || 0), 0)
        const pct = b.commissionPct ?? 0
        return { id: b.id, name: b.name, cuts: cuts.length, revenue, pct, pay: (revenue * pct) / 100 }
      })
      .sort((a, b) => b.revenue - a.revenue)
    return {
      completed,
      cutsRevenue,
      storeRevenue,
      totalRevenue: cutsRevenue + storeRevenue,
      monthExpenses,
      expenseTotal,
      profit: cutsRevenue + storeRevenue - expenseTotal,
      byCategory,
      barberPay,
    }
  }, [appointments, orders, expenses, barbers, month])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.concept.trim() || !form.amount.trim()) return
    if (editingId) {
      await updateExpense(editingId, form)
      setEditingId(null)
    } else {
      await addExpense(form)
    }
    setForm(empty)
  }

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ['Reporte Exclusive Barber Show'],
      ['Mes', month],
      [],
      ['Ingresos por cortes', monthData.cutsRevenue.toFixed(2)],
      ['Ingresos por tienda', monthData.storeRevenue.toFixed(2)],
      ['Ingresos totales', monthData.totalRevenue.toFixed(2)],
      ['Gastos', monthData.expenseTotal.toFixed(2)],
      ['Ganancia neta', monthData.profit.toFixed(2)],
      [],
      ['Gastos del mes'],
      ['Fecha', 'Concepto', 'Categoría', 'Monto'],
      ...monthData.monthExpenses.map((e) => [e.date, e.concept, e.category, Number(e.amount).toFixed(2)]),
      [],
      ['Comisión por barbero'],
      ['Barbero', 'Cortes', 'Ingresos', '% Comisión', 'A pagar'],
      ...monthData.barberPay.map((b) => [
        b.name,
        b.cuts,
        b.revenue.toFixed(2),
        `${b.pct}%`,
        b.pay.toFixed(2),
      ]),
    ]
    downloadCsv(`exclusive-contabilidad-${month}.csv`, rows)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mes</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={inputCls + ' w-auto'}
          />
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm font-bold text-primary-light transition-colors hover:bg-primary/10"
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ingresos cortes" value={`$${monthData.cutsRevenue.toFixed(2)}`} icon={Scissors} accent="bg-primary/20 text-primary-light" />
        <StatCard label="Ingresos tienda" value={`$${monthData.storeRevenue.toFixed(2)}`} icon={ShoppingBag} accent="bg-accent/20 text-accent" />
        <StatCard label="Gastos" value={`$${monthData.expenseTotal.toFixed(2)}`} icon={Wallet} accent="bg-red-500/20 text-red-400" />
        <StatCard
          label="Ganancia neta"
          value={`$${monthData.profit.toFixed(2)}`}
          icon={DollarSign}
          accent="bg-gold/20 text-gold"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-surface p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-light">
            {editingId ? 'Editar gasto' : 'Registrar gasto'}
          </h3>
          <Field label="Concepto" value={form.concept} onChange={(v) => setForm((f) => ({ ...f, concept: v }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}
                className={inputCls}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Monto ($)" value={form.amount} onChange={(v) => setForm((f) => ({ ...f, amount: v }))} type="number" />
          </div>
          <Field label="Fecha" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} type="date" />
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 font-bold text-background"
            >
              <Plus size={16} />
              {editingId ? 'Guardar' : 'Agregar'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(empty)
                }}
                className="rounded-full border border-primary/30 px-6 py-2.5 font-bold text-slate-300"
              >
                Cancelar
              </button>
            )}
          </div>

          {Object.keys(monthData.byCategory).length > 0 && (
            <div className="rounded-xl border border-primary/10 bg-card p-3 text-xs text-slate-300">
              <p className="mb-1 font-bold uppercase tracking-wider text-slate-400">Por categoría</p>
              {Object.entries(monthData.byCategory).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between capitalize">
                  <span>{cat}</span>
                  <span className="font-bold text-white">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="rounded-2xl border border-primary/15 bg-surface p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-light">
            <Wallet size={16} />
            Comisión por barbero ({month})
          </h3>
          <ul className="flex flex-col gap-2">
            {monthData.barberPay.map((b) => (
              <li key={b.id} className="rounded-xl border border-primary/10 bg-card px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">{b.name}</span>
                  <span className="font-bold text-gold">${b.pay.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {b.cuts} cortes · ${b.revenue.toFixed(2)} generado · {b.pct}%
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Ajusta el % de comisión de cada barbero en la pestaña "Barberos".
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-surface p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary-light">
          Gastos de {month}
        </h3>
        {monthData.monthExpenses.length === 0 ? (
          <p className="text-sm text-slate-400">No hay gastos registrados este mes.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {monthData.monthExpenses.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-primary/10 bg-card px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{e.concept}</p>
                  <p className="text-xs capitalize text-slate-400">
                    {e.category} · {e.date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-bold text-red-400">-${Number(e.amount).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(e.id)
                      setForm({
                        concept: e.concept,
                        category: e.category,
                        amount: e.amount,
                        date: e.date,
                        notes: e.notes ?? '',
                      })
                    }}
                    className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteExpense(e.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10"
                    aria-label="Eliminar gasto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ThemeTab() {
  const { settings, updateSettings } = useSettings()
  const current = settings.theme ?? 'normal'
  const [saved, setSaved] = useState(false)

  const select = (key: ThemeKey) => {
    updateSettings({ ...settings, theme: key })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-300">
        Elige el diseño según la temporada. Los colores y el banner de la página cambian al instante
        para todos los visitantes.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {THEMES.map((t) => {
          const active = current === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => select(t.key)}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-primary/15 bg-surface hover:border-primary/40'
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-2xl">
                {t.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-white">
                  {t.label}
                  {active && (
                    <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                      Activo
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{t.description}</p>
                <div className="mt-2 flex gap-1.5">
                  {t.swatch.map((c) => (
                    <span
                      key={c}
                      className="h-4 w-4 rounded-full border border-white/15"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {saved && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary-light">
          Diseño actualizado correctamente.
        </p>
      )}
    </div>
  )
}

function BarbersTab() {
  const { barbers, addBarber, updateBarber, deleteBarber } = useData()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCommission, setEditCommission] = useState('30')

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
        Los clientes eligen a su barbero al reservar una cita. El panel calcula los cortes, los
        ingresos y la comisión de cada uno.
      </p>

      <ul className="flex flex-col gap-2">
        {barbers.map((b) => (
          <li key={b.id} className="rounded-xl border border-primary/15 bg-surface p-3">
            {editing === b.id ? (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nombre"
                  className={inputCls}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Comisión
                  </span>
                  <input
                    type="number"
                    value={editCommission}
                    onChange={(e) => setEditCommission(e.target.value)}
                    className={inputCls + ' w-24'}
                  />
                  <span className="text-sm text-slate-400">%</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateBarber(b.id, {
                        name: editName,
                        commissionPct: Number(editCommission) || 0,
                      })
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
                  <div>
                    <p className="font-semibold text-white">{b.name}</p>
                    <p className="text-xs text-slate-400">
                      Comisión: {b.commissionPct ?? 0}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(b.id)
                      setEditName(b.name)
                      setEditCommission(String(b.commissionPct ?? 30))
                    }}
                    className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary-light hover:bg-primary/10"
                  >
                    Editar
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
  const { clients, appointments, cutsByClient, updateClientById, deleteClient, adjustClientPoints, addBirthdayClaim, hasBirthdayClaim } =
    useData()
  const [editing, setEditing] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cedula: '',
    birthDate: '',
  })

  const noShows = useMemo(() => {
    const map: Record<string, number> = {}
    appointments.forEach((a) => {
      if (effectiveStatus(a) === 'ausente') map[a.clientId] = (map[a.clientId] || 0) + 1
    })
    return map
  }, [appointments])

  const list = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.referralCode || '').toLowerCase().includes(q),
    )
  }, [clients, search])

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

  const findCode = (raw: string) => {
    const code = raw.includes('|') ? raw.split('|').pop() ?? '' : raw
    const found = clients.find(
      (c) => c.referralCode === code.trim() || c.id === code.trim(),
    )
    if (found) {
      setSearch(found.name)
      setScanError('')
    } else {
      setScanError('No se encontró ningún cliente con ese carnet.')
    }
  }

  const startScan = async () => {
    setScanError('')
    const Detector = (
      window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike }
    ).BarcodeDetector
    if (!Detector) {
      setScanError('Tu navegador no soporta escaneo. Entra el código del carnet manualmente.')
      return
    }
    setScanning(true)
    let active = true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      const video = document.createElement('video')
      video.srcObject = stream
      video.setAttribute('playsinline', 'true')
      await video.play()
      const detector = new Detector({ formats: ['qr_code'] })
      const deadline = Date.now() + 20000
      const stop = () => {
        active = false
        stream.getTracks().forEach((t) => t.stop())
        setScanning(false)
      }
      const tick = async () => {
        if (!active) return
        try {
          const codes = await detector.detect(video)
          if (codes.length > 0) {
            findCode(codes[0].rawValue)
            stop()
            return
          }
        } catch {
          /* ignore */
        }
        if (Date.now() > deadline) {
          stop()
          setScanError('No se detectó ningún código. Intenta de nuevo.')
          return
        }
        requestAnimationFrame(tick)
      }
      tick()
    } catch {
      setScanning(false)
      setScanError('No pudimos acceder a la cámara. Entra el código manualmente.')
    }
  }

  const addPoints = async (c: Client) => {
    const amount = window.prompt(`Puntos a sumar a ${c.name} (usa negativo para restar):`, '10')
    if (amount === null) return
    const delta = Number(amount)
    if (!delta) return
    const reason = window.prompt('Motivo:', delta > 0 ? 'Ajuste del administrador' : 'Corrección')
    if (reason === null) return
    await adjustClientPoints(c.id, delta, reason || 'Ajuste del administrador')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <ScanLine
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setScanError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && findCode(search)}
              placeholder="Buscar por nombre, celular o escanear carnet (EXCLUSIVE|código)"
              className={inputCls + ' pl-10'}
            />
          </div>
          <button
            type="button"
            onClick={startScan}
            disabled={scanning}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-bold text-background disabled:opacity-60"
          >
            <ScanLine size={16} />
            {scanning ? 'Escaneando...' : 'Escanear carnet'}
          </button>
        </div>
        {scanError && <p className="text-xs font-semibold text-orange-400">{scanError}</p>}
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-primary/30 px-4 py-8 text-center text-sm text-slate-400">
          No hay clientes que coincidan.
        </p>
      ) : (
        <ul className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto">
          {list.map((c) => {
            const cuts = cutsByClient(c.id)
            const level = levelForCuts(cuts)
            const prizes = noShows[c.id] || 0
            return (
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
                        <p className="flex items-center gap-2 font-semibold text-white">
                          {c.name}
                          <span className={`text-xs font-bold ${level.colorClass}`}>
                            {level.emoji} {level.name}
                          </span>
                        </p>
                        <p className="text-sm text-slate-400">{c.phone}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => addPoints(c)}
                          className="rounded-lg border border-gold/40 px-3 py-2 text-xs font-bold text-gold hover:bg-gold/10"
                        >
                          ± Puntos
                        </button>
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
                        <span className="font-semibold text-slate-300">Puntos:</span>{' '}
                        <span className="font-bold text-gold">{clientPoints(c)}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-slate-300">Cortes:</span> {cuts}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-300">Ausencias:</span>{' '}
                        <span className={prizes > 0 ? 'font-bold text-orange-400' : ''}>{prizes}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-slate-300">Cumpleaños:</span> {c.birthDate || '—'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-300">Gmail:</span> {c.email || '—'}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-300">Carnet:</span>{' '}
                        {c.referralCode || '—'}
                      </p>
                    </div>

                    {(() => {
                      const now = new Date()
                      const [y, m, d] = (c.birthDate || '').split('-').map(Number)
                      const isBday = !!(y && m && d) && now.getMonth() + 1 === m && now.getDate() === d
                      if (!isBday) return null
                      const claimed = hasBirthdayClaim(c.id)
                      return (
                        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2">
                          <Cake size={14} className="text-gold" />
                          <span className="text-xs font-bold text-gold">¡Cumpleaños hoy! (corte gratis)</span>
                          {claimed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                              <BadgeCheck size={13} /> Constancia registrada este año
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={async () => {
                                const note = window.prompt(
                                  'Constancia de cumpleaños: verifica la cédula/identidad del cliente y describe la verificación:',
                                  'Cédula verificada',
                                )
                                if (note === null) return
                                const ok = await addBirthdayClaim(c.id, note)
                                if (!ok) {
                                  window.alert('Este cliente ya tiene constancia de cumpleaños este año.')
                                }
                              }}
                              className="rounded-full border border-gold/50 px-3 py-1 text-xs font-bold text-gold transition-colors hover:bg-gold/20"
                            >
                              Registrar constancia
                            </button>
                          )}
                        </div>
                      )
                    })()}
                  </>
                )}
              </li>
            )
          })}
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

      <h3 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-primary-light">
        Programa de fidelidad y puntos
      </h3>
      <div className="grid gap-5 rounded-2xl border border-primary/15 bg-surface p-5 sm:grid-cols-2">
        <Field
          label="Puntos por corte"
          value={String(draft.loyalty.pointsPerCut)}
          onChange={(v) =>
            setDraft((d) => ({ ...d, loyalty: { ...d.loyalty, pointsPerCut: Number(v) || 0 } }))
          }
          type="number"
        />
        <Field
          label="Puntos por dólar del servicio"
          value={String(draft.loyalty.pointsPerDollar)}
          onChange={(v) =>
            setDraft((d) => ({ ...d, loyalty: { ...d.loyalty, pointsPerDollar: Number(v) || 0 } }))
          }
          type="number"
        />
        <Field
          label="Bono de bienvenida (puntos)"
          value={String(draft.loyalty.signupBonus)}
          onChange={(v) =>
            setDraft((d) => ({ ...d, loyalty: { ...d.loyalty, signupBonus: Number(v) || 0 } }))
          }
          type="number"
        />
        <Field
          label="Puntos para quien invita"
          value={String(draft.loyalty.referralBonus)}
          onChange={(v) =>
            setDraft((d) => ({ ...d, loyalty: { ...d.loyalty, referralBonus: Number(v) || 0 } }))
          }
          type="number"
        />
        <Field
          label="Puntos para el invitado"
          value={String(draft.loyalty.referredBonus)}
          onChange={(v) =>
            setDraft((d) => ({ ...d, loyalty: { ...d.loyalty, referredBonus: Number(v) || 0 } }))
          }
          type="number"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-primary/15 bg-surface p-5">
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-white">
          <input
            type="checkbox"
            checked={draft.loyalty.happyHour.enabled}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                loyalty: {
                  ...d.loyalty,
                  happyHour: { ...d.loyalty.happyHour, enabled: e.target.checked },
                },
              }))
            }
            className="h-5 w-5 accent-primary"
          />
          Happy Hour (descuento en horarios de poca demanda)
        </label>

        {draft.loyalty.happyHour.enabled && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field
              label="Desde (hora)"
              value={String(draft.loyalty.happyHour.startHour)}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  loyalty: {
                    ...d.loyalty,
                    happyHour: { ...d.loyalty.happyHour, startHour: Number(v) || 0 },
                  },
                }))
              }
              type="number"
            />
            <Field
              label="Hasta (hora)"
              value={String(draft.loyalty.happyHour.endHour)}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  loyalty: {
                    ...d.loyalty,
                    happyHour: { ...d.loyalty.happyHour, endHour: Number(v) || 0 },
                  },
                }))
              }
              type="number"
            />
            <Field
              label="Descuento (%)"
              value={String(draft.loyalty.happyHour.discountPct)}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  loyalty: {
                    ...d.loyalty,
                    happyHour: { ...d.loyalty.happyHour, discountPct: Number(v) || 0 },
                  },
                }))
              }
              type="number"
            />
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Días
              </label>
              <div className="flex flex-wrap gap-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((label, idx) => {
                  const active = draft.loyalty.happyHour.days.includes(idx)
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setDraft((d) => {
                          const days = active
                            ? d.loyalty.happyHour.days.filter((x) => x !== idx)
                            : [...d.loyalty.happyHour.days, idx]
                          return {
                            ...d,
                            loyalty: { ...d.loyalty, happyHour: { ...d.loyalty.happyHour, days } },
                          }
                        })
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                        active
                          ? 'bg-gradient-to-r from-primary to-accent text-background'
                          : 'border border-primary/25 text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
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

