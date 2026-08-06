import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import nodemailer from 'nodemailer'

const TIMEZONE = process.env.REPORT_TIMEZONE || 'America/Costa_Rica'
const GMAIL_USER = process.env.GMAIL_USER || ''
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''
const REPORT_EMAIL = process.env.REPORT_EMAIL || GMAIL_USER

function todayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

const isToday = (iso) => typeof iso === 'string' && iso.slice(0, 10) === todayKey()

async function all(db, coll) {
  const snap = await db.collection(coll).get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

const money = (n) => '$' + (Number(n) || 0).toFixed(2)

function buildHtml(report) {
  const rows = report.orders.map(
    (o) => `<tr>
      <td>${o.clientName}</td>
      <td>${o.items.map((i) => `${i.name} x${i.qty}`).join('<br>')}</td>
      <td align="right">${money(o.total)}</td>
    </tr>`,
  )

  const barberRows = report.barbers
    .map(
      (b) => `<tr>
        <td>${b.name}</td>
        <td align="center">${b.cuts}</td>
        <td align="right">${money(b.revenue)}</td>
      </tr>`,
    )
    .join('')

  const newClients = report.newClients
    .map((c) => `<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.cedula || '—'}</td></tr>`)
    .join('')

  const birthdays = report.birthdayClients
    .map((c) => `<tr><td>${c.name}</td><td>${c.phone}</td></tr>`)
    .join('')

  return `<!doctype html>
<html lang="es">
<body style="margin:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;padding:24px">
  <div style="max-width:640px;margin:0 auto;border:1px solid rgba(212,175,55,.35);border-radius:16px;overflow:hidden;background:#111">
    <div style="background:linear-gradient(135deg,#d4af37,#f0d078);padding:20px 24px;text-align:center">
      <div style="font-size:22px;font-weight:900;letter-spacing:3px;color:#0a0a0a">EXCLUSIVE</div>
      <div style="font-size:11px;letter-spacing:5px;font-weight:700;color:#0a0a0a">BARBER SHOW</div>
    </div>
    <div style="padding:24px">
      <p style="font-size:13px;color:#9ca3af">Reporte de actividades y ventas</p>
      <h2 style="margin:0 0 20px;color:#d4af37">${report.date}</h2>

      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${report.cards
          .map(
            (c) => `<div style="flex:1;min-width:110px;border:1px solid rgba(212,175,55,.25);border-radius:10px;padding:12px;text-align:center">
              <div style="font-size:20px;font-weight:800;color:#fff">${c.value}</div>
              <div style="font-size:10px;letter-spacing:1px;color:#9ca3af;margin-top:4px">${c.label}</div>
            </div>`,
          )
          .join('')}
      </div>

      <h3 style="margin:24px 0 10px;color:#d4af37;font-size:14px;letter-spacing:1px">INGRESOS DEL DÍA</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr>
          <td style="padding:8px 0;color:#9ca3af">Por cortes</td>
          <td align="right" style="padding:8px 0;color:#fff;font-weight:700">${money(report.cutsRevenue)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#9ca3af">Por tienda</td>
          <td align="right" style="padding:8px 0;color:#fff;font-weight:700">${money(report.storeRevenue)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-top:1px solid rgba(212,175,55,.3);color:#f0d078;font-weight:800">TOTAL DEL DÍA</td>
          <td align="right" style="padding:10px 0;border-top:1px solid rgba(212,175,55,.3);color:#f0d078;font-weight:900">${money(report.totalRevenue)}</td>
        </tr>
      </table>

      <h3 style="margin:24px 0 10px;color:#d4af37;font-size:14px;letter-spacing:1px">CORTES POR BARBERO</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="color:#9ca3af;text-align:left">
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Barbero</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)" align="center">Cortes</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)" align="right">Ingresos</th>
        </tr>
        ${barberRows || '<tr><td colspan="3" style="padding:8px 0;color:#6b7280">Sin cortes registrados.</td></tr>'}
      </table>

      ${rows.length ? `
      <h3 style="margin:24px 0 10px;color:#d4af37;font-size:14px;letter-spacing:1px">PEDIDOS DE LA TIENDA</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="color:#9ca3af;text-align:left">
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Cliente</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Productos</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)" align="right">Total</th>
        </tr>
        ${rows.join('')}
      </table>` : ''}

      ${newClients ? `
      <h3 style="margin:24px 0 10px;color:#d4af37;font-size:14px;letter-spacing:1px">CLIENTES NUEVOS (${report.newClients.length})</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="color:#9ca3af;text-align:left">
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Nombre</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Celular</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Cédula</th>
        </tr>
        ${newClients}
      </table>` : ''}

      ${birthdays ? `
      <h3 style="margin:24px 0 10px;color:#f0d078;font-size:14px;letter-spacing:1px">CUMPLEAÑOS DE HOY (CORTE GRATIS)</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr style="color:#9ca3af;text-align:left">
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Nombre</th>
          <th style="padding:6px 0;border-bottom:1px solid rgba(212,175,55,.2)">Celular</th>
        </tr>
        ${birthdays}
      </table>` : ''}

      <p style="margin-top:24px;font-size:11px;color:#6b7280">Generado automáticamente por Exclusive Barber Show.</p>
    </div>
  </div>
</body>
</html>`
}

async function main() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error('Faltan GMAIL_USER o GMAIL_APP_PASSWORD. Revisa los secretos del repositorio.')
  }
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!b64) {
    throw new Error('Falta FIREBASE_SERVICE_ACCOUNT. Agrega la clave del servicio en base64.')
  }

  const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  initializeApp({ credential: cert(sa) })
  const db = getFirestore()

  const [visits, appointments, orders, clients] = await Promise.all([
    all(db, 'visits'),
    all(db, 'appointments'),
    all(db, 'orders'),
    all(db, 'clients'),
  ])

  const visitsToday = visits.filter((v) => v.type === 'visit' && isToday(v.date))
  const haircutsToday = visits.filter((v) => v.type === 'haircut' && isToday(v.date))
  const ordersToday = orders.filter((o) => isToday(o.createdAt))
  const newClients = clients.filter((c) => isToday(c.createdAt))
  const appointmentsToday = appointments.filter((a) => isToday(a.createdAt))

  const now = new Date()
  const nowKey = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(now)
  const upcomingAppointments = appointments.filter((a) => (a.date || '').slice(0, 10) >= nowKey)

  const cutsRevenue = haircutsToday.reduce((s, h) => s + (Number(h.price) || 0), 0)
  const storeRevenue = ordersToday.reduce((s, o) => s + (Number(o.total) || 0), 0)

  const byBarber = {}
  haircutsToday.forEach((h) => {
    const name = h.barberName || 'Sin barbero'
    byBarber[name] = byBarber[name] || { cuts: 0, revenue: 0 }
    byBarber[name].cuts += 1
    byBarber[name].revenue += Number(h.price) || 0
  })

  const birthdayClients = clients.filter((c) => {
    const [y, m, d] = (c.birthDate || '').split('-').map(Number)
    return y && m && d && now.getMonth() + 1 === m && now.getDate() === d
  })

  const report = {
    date: now.toLocaleDateString('es-ES', {
      timeZone: TIMEZONE,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    cards: [
      { label: 'VISITAS', value: visitsToday.length },
      { label: 'CORTES', value: haircutsToday.length },
      { label: 'CITAS RESERVADAS', value: appointmentsToday.length },
      { label: 'CLIENTES NUEVOS', value: newClients.length },
      { label: 'PEDIDOS', value: ordersToday.length },
    ],
    cutsRevenue,
    storeRevenue,
    totalRevenue: cutsRevenue + storeRevenue,
    barbers: Object.entries(byBarber)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue),
    orders: ordersToday.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')),
    newClients,
    birthdayClients,
    upcomingCount: upcomingAppointments.length,
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  })

  await transporter.sendMail({
    from: `"Exclusive Barber Show" <${GMAIL_USER}>`,
    to: REPORT_EMAIL,
    subject: `📊 Resumen del día ${report.date} — Exclusive Barber Show`,
    html: buildHtml(report),
  })

  console.log(
    `Reporte enviado a ${REPORT_EMAIL}: ${visitsToday.length} visitas, ${haircutsToday.length} cortes, ${ordersToday.length} pedidos, ingresos ${money(report.totalRevenue)}.`,
  )
}

main().catch((err) => {
  console.error('Error generando el reporte diario:', err.message || err)
  process.exit(1)
})
