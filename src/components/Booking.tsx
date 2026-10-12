import { type FormEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BadgePercent,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Scissors,
  Star,
  UserPlus,
} from 'lucide-react'
import SectionHeader from './SectionHeader'
import { useData } from '../context/data-context'
import { useSettings } from '../context/settings-context'
import { applyDiscount, effectiveStatus, isHappyHour, STATUS_META } from '../lib/loyalty'

export default function Booking() {
  const {
    currentClient,
    services,
    barbers,
    bookHaircut,
    openRegister,
    appointments,
    rateAppointment,
  } = useData()
  const { settings } = useSettings()
  const [serviceId, setServiceId] = useState('')
  const [barberId, setBarberId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState<string | null>(null)

  const myAppointments = currentClient
    ? appointments.filter((a) => a.clientId === currentClient.id).slice(-5).reverse()
    : []

  const selectedService = services.find((s) => s.id === serviceId)
  const basePrice = Number(selectedService?.price) || 0
  const happy = date ? isHappyHour(date, time, settings.loyalty.happyHour) : false
  const finalPrice = useMemo(
    () => (happy ? applyDiscount(basePrice, settings.loyalty.happyHour.discountPct) : basePrice),
    [happy, basePrice, settings.loyalty.happyHour.discountPct],
  )

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!serviceId || !barberId || !date) return
    const service = services.find((s) => s.id === serviceId)
    await bookHaircut(serviceId, date, barberId, time)
    setBooked(service ? service.name : 'tu cita')
    setDate('')
    setTime('')
    setServiceId('')
    setBarberId('')
    setTimeout(() => setBooked(null), 5000)
  }

  const inputCls =
    'w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none'

  return (
    <section id="citas" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Agenda"
        title="Reserva tu cita"
        subtitle="Elige tu barbero, tu servicio y la fecha que prefieras. Confirmamos tu hora y te la recordamos."
      />

      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-primary/15 bg-card p-8"
        >
          {currentClient ? (
            <>
              <p className="mb-6 text-sm text-slate-300">
                Hola <span className="font-bold text-white">{currentClient.name}</span>, elige tu
                barbero y reserva tu hora.
              </p>
              <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Elige tu barbero
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {barbers.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBarberId(b.id)}
                        className={`rounded-xl border px-3 py-4 text-center transition-all ${
                          barberId === b.id
                            ? 'border-primary bg-primary/15 text-white'
                            : 'border-primary/20 bg-surface text-slate-300 hover:border-primary/50'
                        }`}
                      >
                        <Scissors
                          size={20}
                          className={`mx-auto mb-2 ${barberId === b.id ? 'text-primary-light' : 'text-slate-500'}`}
                        />
                        <span className="block text-sm font-bold">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Servicio</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    className={inputCls}
                  >
                    <option value="">Selecciona un servicio...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — ${s.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">Fecha</label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Hora (opcional)
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {happy && selectedService && (
                  <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
                    <BadgePercent size={18} className="mt-0.5 shrink-0 text-gold" />
                    <p className="text-sm text-slate-200">
                      ¡Happy Hour! Con {settings.loyalty.happyHour.discountPct}% de descuento este
                      corte te sale en{' '}
                      <span className="font-bold text-gold">${finalPrice.toFixed(2)}</span>.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent py-3.5 font-bold text-background transition-transform hover:scale-[1.02]"
                >
                  <CalendarCheck size={18} />
                  Reservar ahora
                </button>
              </form>

              {booked && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary-light"
                >
                  <CheckCircle2 size={15} className="mr-1 inline-block" />
                  {booked} reservado. ¡Te esperamos!
                </motion.p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary-light">
                <UserPlus size={30} />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">
                Regístrate para reservar
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                Necesitamos tu registro para asignarte la cita y recordarte el día. Toma menos de un
                minuto.
              </p>
              <button
                type="button"
                onClick={() => openRegister()}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 font-bold text-background transition-transform hover:scale-105"
              >
                <UserPlus size={18} />
                Registrarme gratis
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-primary/15 bg-card p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <Scissors size={20} className="text-primary-light" />
            <h3 className="font-display font-bold text-white">Mis próximas citas</h3>
          </div>

          {myAppointments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-primary/30 px-4 py-8 text-center text-sm text-slate-400">
              Aún no tienes citas reservadas.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {myAppointments.map((a) => {
                const status = effectiveStatus(a)
                const meta = STATUS_META[status]
                return (
                  <li key={a.id} className="rounded-xl border border-primary/15 bg-surface px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{a.serviceName}</p>
                        <p className="text-xs text-slate-400">
                          {a.barberName ? `Con ${a.barberName}` : 'Sin barbero asignado'} · ${a.price}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-primary-light">
                          <CalendarDays size={12} />
                          {new Date(a.date + 'T00:00:00').toLocaleDateString('es', {
                            day: '2-digit',
                            month: 'short',
                          })}
                          {a.time && (
                            <>
                              <Clock size={12} className="ml-1" />
                              {a.time}
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    {status === 'completada' && (
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-primary/10 pt-2">
                        <span className="text-xs text-slate-400">
                          {a.pointsEarned
                            ? `Ganaste ${a.pointsEarned} puntos`
                            : 'Corte completado'}
                        </span>
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              aria-label={`Calificar ${i + 1} estrellas`}
                              onClick={() => rateAppointment(a.id, i + 1)}
                              className="p-0.5"
                            >
                              <Star
                                size={16}
                                className={
                                  i < (a.rating ?? 0) ? 'fill-gold text-gold' : 'text-slate-600'
                                }
                              />
                            </button>
                          ))}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  )
}
