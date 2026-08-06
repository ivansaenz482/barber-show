import { type FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Cake,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Mail,
  Pencil,
  Phone,
  QrCode,
  User,
  UserCheck,
  X,
} from 'lucide-react'
import { useData } from '../context/data-context'

const inputCls =
  'w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none'

export default function ClientRegisterModal() {
  const {
    registerModalOpen,
    setRegisterModalOpen,
    currentClient,
    registerClient,
    updateClient,
    logoutClient,
    isBirthday,
  } = useData()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cedula: '',
    birthDate: '',
  })
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  const close = () => {
    setRegisterModalOpen(false)
    setError('')
    setEditing(false)
  }

  const startEdit = () => {
    if (!currentClient) return
    setForm({
      name: currentClient.name,
      phone: currentClient.phone,
      email: currentClient.email,
      cedula: currentClient.cedula,
      birthDate: currentClient.birthDate,
    })
    setEditing(true)
    setError('')
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.cedula.trim() || !form.birthDate) {
      setError('Completa los campos obligatorios (el correo es opcional).')
      return
    }
    setError('')
    if (editing && currentClient) {
      await updateClient(form)
      setEditing(false)
    } else {
      await registerClient(form)
    }
  }

  return (
    <AnimatePresence>
      {registerModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
        >
          <motion.div
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-primary/15 bg-surface px-6 py-4">
              <div className="flex items-center gap-2">
                {currentClient ? (
                  editing ? (
                    <Pencil size={18} className="text-primary-light" />
                  ) : (
                    <UserCheck size={18} className="text-primary-light" />
                  )
                ) : (
                  <QrCode size={18} className="text-primary-light" />
                )}
                <h2 className="font-display text-lg font-bold text-white">
                  {currentClient
                    ? editing
                      ? 'Editar mis datos'
                      : 'Mi cuenta Exclusive'
                    : 'Registro de cliente'}
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

            {currentClient && !editing ? (
              <div className="px-6 py-8">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 text-center">
                  <p className="font-display text-lg font-bold text-white">{currentClient.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{currentClient.phone}</p>
                  {currentClient.email && <p className="text-xs text-slate-400">{currentClient.email}</p>}
                </div>

                <div
                  className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 ${
                    isBirthday
                      ? 'border-gold/40 bg-gold/10'
                      : 'border-primary/20 bg-surface'
                  }`}
                >
                  <Cake
                    size={20}
                    className={isBirthday ? 'shrink-0 text-gold' : 'shrink-0 text-primary-light'}
                  />
                  <p className="text-sm leading-relaxed text-slate-300">
                    {isBirthday ? (
                      <span className="font-bold text-gold">
                        ¡Hoy es tu cumpleaños! Tu corte es GRATIS. Escanea el código de la barbería
                        y preséntalo en caja.
                      </span>
                    ) : (
                      <>
                        Naciste el{' '}
                        <span className="font-semibold text-white">{currentClient.birthDate}</span>.
                        El día de tu cumpleaños el corte es{' '}
                        <span className="font-semibold text-gold">GRATIS</span>.
                      </>
                    )}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3 font-bold text-background transition-transform hover:scale-[1.02]"
                  >
                    <Pencil size={16} />
                    Editar mis datos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logoutClient()
                      close()
                    }}
                    className="w-full rounded-full border border-primary/40 py-3 font-bold text-primary-light transition-colors hover:bg-primary/10"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4 px-6 py-6">
                <p className="text-sm text-slate-300">
                  {editing ? (
                    <>Corrige los datos que necesites y pulsa guardar.</>
                  ) : (
                    <>
                      Escaneaste el QR de{' '}
                      <span className="font-bold text-primary-light">Exclusive Barber Show</span>.
                      Regístrate en segundos para acceder a beneficios:
                    </>
                  )}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Nombre completo *
                    </label>
                    <div className="relative">
                      <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Tu nombre"
                        className={inputCls + ' pl-10'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Celular *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+1 555 000 0000"
                        className={inputCls + ' pl-10'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Gmail (opcional)
                    </label>
                    <div className="relative">
                      <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="tucorreo@gmail.com"
                        className={inputCls + ' pl-10'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Cédula *
                    </label>
                    <div className="relative">
                      <CreditCard size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={form.cedula}
                        onChange={(e) => setForm((f) => ({ ...f, cedula: e.target.value }))}
                        placeholder="N° de identificación"
                        className={inputCls + ' pl-10'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Fecha de nacimiento *
                    </label>
                    <div className="relative">
                      <CalendarDays size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="date"
                        value={form.birthDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                        className={inputCls + ' pl-10'}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-400">
                    {error}
                  </p>
                )}

                <div className="mt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3.5 font-bold text-background transition-transform hover:scale-[1.02]"
                  >
                    <CheckCircle2 size={18} />
                    {editing ? 'Guardar cambios' : 'Completar registro'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setError('')
                      }}
                      className="w-full rounded-full border border-primary/40 py-3 font-bold text-primary-light transition-colors hover:bg-primary/10"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
