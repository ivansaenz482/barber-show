import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Check,
  Copy,
  Gift,
  History,
  QrCode,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useData } from '../context/data-context'
import { useSettings } from '../context/settings-context'
import { clientPoints, levelForCuts, nextLevel, LEVELS } from '../lib/loyalty'
import SectionHeader from './SectionHeader'

export default function ClientAccount() {
  const {
    currentClient,
    appointments,
    rewards,
    pointMovements,
    redemptions,
    cutsByClient,
    redeemReward,
    openRegister,
  } = useData()
  const { settings } = useSettings()
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')

  const cuts = currentClient ? cutsByClient(currentClient.id) : 0
  const points = currentClient ? clientPoints(currentClient) : 0
  const level = levelForCuts(cuts)
  const upcoming = nextLevel(cuts)

  const progress = useMemo(() => {
    if (!upcoming) return 100
    const prev = [...LEVELS].reverse().find((l) => l.minCuts <= cuts) ?? LEVELS[0]
    const span = upcoming.minCuts - prev.minCuts
    if (span <= 0) return 100
    return Math.min(100, Math.round(((cuts - prev.minCuts) / span) * 100))
  }, [cuts, upcoming])

  const myHistory = useMemo(
    () =>
      currentClient
        ? pointMovements
            .filter((m) => m.clientId === currentClient.id)
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 8)
        : [],
    [pointMovements, currentClient],
  )

  const myRedemptions = useMemo(
    () =>
      currentClient
        ? redemptions.filter((r) => r.clientId === currentClient.id && !r.fulfilled)
        : [],
    [redemptions, currentClient],
  )

  const availableRewards = useMemo(
    () => rewards.filter((r) => r.active).sort((a, b) => a.pointsCost - b.pointsCost),
    [rewards],
  )

  const myRatings = useMemo(
    () =>
      currentClient
        ? appointments
            .filter((a) => a.clientId === currentClient.id && a.status === 'completada')
            .slice(-6)
            .reverse()
        : [],
    [appointments, currentClient],
  )

  const refLink = currentClient?.referralCode
    ? `${window.location.origin}${window.location.pathname}?ref=${currentClient.referralCode}#mi-cuenta`
    : ''

  const share = async () => {
    if (!refLink) return
    const text = `Regístrate en Exclusive Barber Show con mi código ${currentClient?.referralCode} y gana puntos. ${refLink}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Exclusive Barber Show', text, url: refLink })
        return
      } catch {
        /* ignore */
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const redeem = async (id: string, name: string) => {
    const ok = await redeemReward(id)
    setMessage(
      ok
        ? `¡Canjeaste "${name}"! Muéstralo en caja para reclamarlo.`
        : 'No tienes puntos suficientes para este premio.',
    )
    setTimeout(() => setMessage(''), 4000)
  }

  if (!currentClient) {
    return (
      <section id="mi-cuenta" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHeader
          eyebrow="Club Exclusive"
          title="Mi cuenta y mis premios"
          subtitle="Regístrate, acumula puntos en cada corte y canjéalos por premios increíbles."
        />
        <div className="mx-auto max-w-md rounded-3xl border border-primary/15 bg-card p-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary-light">
            <Sparkles size={30} />
          </span>
          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            Cada corte suma puntos. Junta suficientes y llévate cortes gratis, descuentos y productos
            de la tienda. El día de tu cumpleaños el corte es gratis.
          </p>
          <button
            type="button"
            onClick={() => openRegister()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 font-bold text-background transition-transform hover:scale-105"
          >
            <Sparkles size={18} />
            Crear mi cuenta gratis
          </button>
        </div>
      </section>
    )
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&qzone=1&data=${encodeURIComponent(
    `EXCLUSIVE|${currentClient.referralCode || currentClient.id}`,
  )}`

  return (
    <section id="mi-cuenta" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHeader
        eyebrow={`Hola, ${currentClient.name.split(' ')[0]}`}
        title="Mi cuenta Exclusive"
        subtitle="Tus puntos, tu nivel, tu carnet digital y los premios que puedes canjear."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-card to-card p-6 lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Puntos disponibles
              </p>
              <p className="font-display text-5xl font-black text-gold">{points}</p>
            </div>
            <div className="text-right">
              <p className={`font-display text-2xl font-extrabold ${level.colorClass}`}>
                {level.emoji} {level.name}
              </p>
              <p className="text-xs text-slate-400">{cuts} cortes completados</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
              <span>{level.perk}</span>
              {upcoming && (
                <span>
                  {upcoming.name}: {upcoming.minCuts - cuts} cortes más
                </span>
              )}
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/15 bg-surface p-4">
              <div className="flex items-center gap-2 text-primary-light">
                <TrendingUp size={16} />
                <p className="text-xs font-bold uppercase tracking-wider">Cómo ganar puntos</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Ganas <span className="font-bold text-white">{settings.loyalty.pointsPerCut} puntos</span> +{' '}
                {settings.loyalty.pointsPerDollar} por cada dólar de tu corte. Invita a un amigo con tu
                código y gana {settings.loyalty.referralBonus} puntos.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-surface p-4">
              <div className="flex items-center gap-2 text-primary-light">
                <Share2 size={16} />
                <p className="text-xs font-bold uppercase tracking-wider">Invita y gana</p>
              </div>
              <p className="mt-2 break-all text-sm font-bold text-white">
                {currentClient.referralCode || '—'}
              </p>
              <button
                type="button"
                onClick={share}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-xs font-bold text-primary-light transition-colors hover:bg-primary/10"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? '¡Copiado!' : 'Compartir mi enlace'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center rounded-3xl border border-primary/20 bg-card p-6 text-center"
        >
          <div className="flex items-center gap-2 text-primary-light">
            <QrCode size={16} />
            <p className="text-xs font-bold uppercase tracking-wider">Carnet digital</p>
          </div>
          <img
            src={qrUrl}
            alt="Carnet Exclusive"
            className="mt-3 rounded-2xl border border-primary/25 bg-white p-2"
            width={180}
            height={180}
          />
          <p className="mt-3 font-display text-lg font-bold text-white">{currentClient.name}</p>
          <p className="text-xs text-slate-400">
            Muestra este código en la barbería para sumar tus puntos.
          </p>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-primary/15 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Gift size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Premios disponibles</h3>
          </div>
          {availableRewards.length === 0 ? (
            <p className="text-sm text-slate-400">Pronto habrá premios para canjear.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {availableRewards.map((r) => {
                const can = points >= r.pointsCost
                return (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-surface px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.description}</p>
                      <p className="mt-0.5 text-xs font-bold text-gold">{r.pointsCost} pts</p>
                    </div>
                    <button
                      type="button"
                      disabled={!can}
                      onClick={() => redeem(r.id, r.name)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-transform ${
                        can
                          ? 'bg-gradient-to-r from-primary to-accent text-background hover:scale-105'
                          : 'cursor-not-allowed border border-primary/20 text-slate-500'
                      }`}
                    >
                      {can ? 'Canjear' : 'Faltan pts'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {myRedemptions.length > 0 && (
            <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gold">
                Premios por reclamar
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-200">
                {myRedemptions.map((r) => (
                  <li key={r.id}>• {r.rewardName}</li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-slate-400">
                Muéstralos en caja para hacerlos efectivos.
              </p>
            </div>
          )}
          {message && (
            <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary-light">
              {message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-primary/15 bg-card p-6">
            <div className="mb-4 flex items-center gap-2 text-primary-light">
              <History size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Historial de puntos</h3>
            </div>
            {myHistory.length === 0 ? (
              <p className="text-sm text-slate-400">Aún no tienes movimientos de puntos.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {myHistory.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-slate-300">{m.reason}</span>
                    <span
                      className={`shrink-0 font-bold ${m.points >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}
                    >
                      {m.points >= 0 ? '+' : ''}
                      {m.points}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {myRatings.length > 0 && (
            <div className="rounded-3xl border border-primary/15 bg-card p-6">
              <div className="mb-4 flex items-center gap-2 text-primary-light">
                <Award size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider">Mis cortes</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {myRatings.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-slate-300">
                      {a.serviceName}
                      {a.barberName ? ` · ${a.barberName}` : ''}
                    </span>
                    <span className="flex shrink-0 items-center gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < (a.rating ?? 0) ? 'fill-gold' : 'text-slate-600'}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
