import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, CalendarDays, CheckCircle2, Scissors, UserPlus } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { useData } from '../context/data-context'

export default function Booking() {
  const { currentClient, services, bookHaircut, openRegister, appointments } = useData()
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [booked, setBooked] = useState<string | null>(null)

  const myAppointments = currentClient
    ? appointments.filter((a) => a.clientId === currentClient.id).slice(-5).reverse()
    : []

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!serviceId || !date) return
    const service = services.find((s) => s.id === serviceId)
    await bookHaircut(serviceId, date)
    setBooked(service ? service.name : 'tu cita')
    setDate('')
    setServiceId('')
    setTimeout(() => setBooked(null), 5000)
  }

  const inputCls =
    'w-full rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none'

  return (
    <section id="citas" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow="Agenda"
        title="Reserva tu cita"
        subtitle="Elige tu servicio y la fecha que prefieras. Confirmamos tu hora y te la recordamos."
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
                Hola <span className="font-bold text-white">{currentClient.name}</span>, selecciona
                tu servicio y reserva tu hora.
              </p>
              <form onSubmit={submit} className="flex flex-col gap-5">
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
              {myAppointments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-surface px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{a.serviceName}</p>
                    <p className="text-xs text-slate-400">${a.price}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-primary-light">
                    <CalendarDays size={14} />
                    {new Date(a.date + 'T00:00:00').toLocaleDateString('es', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  )
}
