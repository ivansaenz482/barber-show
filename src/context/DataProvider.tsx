import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { store } from '../lib/store'
import type {
  Appointment,
  AppointmentStatus,
  Barber,
  Client,
  Expense,
  GalleryImage,
  Order,
  Plan,
  PointMovement,
  Product,
  Promotion,
  Redemption,
  Reward,
  Service,
  Visit,
} from '../lib/types'
import { galleryImages } from '../data/images'
import { DataContext, type DataContextValue, type Stats } from './data-context'
import { useSettings } from './settings-context'
import { applyDiscount, cutPoints, effectiveStatus, isHappyHour } from '../lib/loyalty'

const CLIENT_KEY = 'exclusive_client_id'
const CART_KEY = 'exclusive_cart'
const VISIT_KEY = 'exclusive_visit_counted'
const REF_KEY = 'exclusive_pending_referral'

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%230a0a0a"/%3E%3Ctext x="200" y="150" fill="%23d4af37" font-size="22" text-anchor="middle" font-family="Arial"%3EAgrega tu foto%3C/text%3E%3C/svg%3E'

const seedServices: Omit<Service, 'id'>[] = [
  { name: 'Corte Clásico', price: '4.00' },
  { name: 'Fade Moderno', price: '5.00' },
  { name: 'Perfilado de Barba', price: '6' },
  { name: 'Corte Infantil', price: '5' },
  { name: 'Ritual Premium', price: '7' },
]

const seedProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Camiseta Exclusive',
    category: 'ropa',
    price: '15',
    image: PLACEHOLDER_IMAGE,
    description: 'Camiseta premium de algodón con el logo Exclusive.',
  },
  {
    name: 'Perfume Barber',
    category: 'perfume',
    price: '25',
    image: PLACEHOLDER_IMAGE,
    description: 'Fragancia masculina con notas amaderadas y frescas.',
  },
  {
    name: 'Kit de Cuidado',
    category: 'accesorio',
    price: '18',
    image: PLACEHOLDER_IMAGE,
    description: 'Pomada, cepillo y aceite para barba de primera calidad.',
  },
]

const seedPromotions: Omit<Promotion, 'id'>[] = [
  {
    title: '¡Bienvenido a Exclusive!',
    description:
      'Regístrate escaneando el QR y obtén descuentos, sorteos y el corte GRATIS el día de tu cumpleaños.',
    image: '',
  },
]

const seedBarbers: Omit<Barber, 'id'>[] = [
  { name: 'Barbero 1', commissionPct: 30 },
  { name: 'Barbero 2', commissionPct: 30 },
  { name: 'Barbero 3', commissionPct: 30 },
]

const seedRewards: Omit<Reward, 'id'>[] = [
  {
    name: 'Corte GRATIS',
    description: 'Un corte clásico completamente gratis.',
    pointsCost: 150,
    active: true,
  },
  {
    name: '50% de descuento',
    description: 'Mitad de precio en tu próximo corte.',
    pointsCost: 80,
    active: true,
  },
  {
    name: 'Perfilado de barba gratis',
    description: 'Perfilado de barba de cortesía con tu corte.',
    pointsCost: 60,
    active: true,
  },
  {
    name: 'Producto de la tienda',
    description: 'Un producto gratis: ropa, perfume o accesorio.',
    pointsCost: 120,
    active: true,
  },
]

const seedPlans: Omit<Plan, 'id'>[] = [
  {
    name: 'Clásico',
    price: '$12',
    description: 'Corte esencial para mantener un look impecable.',
    features: [
      'Corte clásico a máquina y tijera',
      'Lavado',
      'Perfilado de contorno',
      'Secado y peinado',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    price: '$20',
    description: 'El ritual completo para los que cuidan cada detalle.',
    features: [
      'Corte clásico o fade',
      'Perfilado y arreglo de barba',
      'Toalla caliente y afeitado de precisión',
      'Lavado con productos premium',
      'Peinado final con cera o pomada',
    ],
    featured: true,
  },
  {
    name: 'Infantil',
    price: '$8',
    description: 'Cortes cómodos y divertidos para los pequeños.',
    features: [
      'Corte infantil a máquina y tijera',
      'Silla especial para niños',
      'Lavado y secado',
      'Te garantizamos que le encantará el corte',
    ],
    featured: false,
  },
]

function getBirthdayToday(birthDate: string) {
  if (!birthDate) return false
  const now = new Date()
  const [y, m, d] = birthDate.split('-').map(Number)
  if (!y || !m || !d) return false
  return now.getMonth() + 1 === m && now.getDate() === d
}

export default function DataProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const loyalty = settings.loyalty
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [visits, setVisits] = useState<Visit[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [pointMovements, setPointMovements] = useState<PointMovement[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>(galleryImages)
  const [stats, setStats] = useState<Stats>({ visits: 0, haircuts: 0 })
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [registerCallback, setRegisterCallback] = useState<(() => void) | undefined>(undefined)
  const [cart, setCart] = useState<Record<string, number>>({})

  const cloud = store.isCloud()

  useEffect(() => {
    const unsubs = [
      store.subscribe<Service>('services', setServices),
      store.subscribe<Product>('products', setProducts),
      store.subscribe<Promotion>('promotions', setPromotions),
      store.subscribe<Plan>('plans', setPlans),
      store.subscribe<Barber>('barbers', setBarbers),
      store.subscribe<Client>('clients', setClients),
      store.subscribe<Order>('orders', setOrders),
      store.subscribe<Appointment>('appointments', setAppointments),
      store.subscribe<Visit>('visits', setVisits),
      store.subscribe<Reward>('rewards', setRewards),
      store.subscribe<Expense>('expenses', setExpenses),
      store.subscribe<PointMovement>('pointMovements', setPointMovements),
      store.subscribe<Redemption>('redemptions', setRedemptions),
      store.subscribe<GalleryImage>('gallery', (items) =>
        setGallery([...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))),
      ),
    ]
    store.statsGet('main').then((s) => {
      setStats({ visits: Number(s.visits) || 0, haircuts: Number(s.haircuts) || 0 })
    })
    return () => unsubs.forEach((u) => u())
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (raw) setCart(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    let cancelled = false
    const seed = async () => {
      const meta = (await store.getDoc('_meta', 'seed')) ?? {}
      const jobs: {
        flag: string
        items: Record<string, unknown>[]
        empty: boolean
        apply: () => void
      }[] = [
        {
          flag: 'services',
          items: seedServices,
          empty: services.length === 0,
          apply: () => setServices(seedServices as Service[]),
        },
        {
          flag: 'products',
          items: seedProducts,
          empty: products.length === 0,
          apply: () => setProducts(seedProducts as Product[]),
        },
        {
          flag: 'promotions',
          items: seedPromotions,
          empty: promotions.length === 0,
          apply: () => setPromotions(seedPromotions as Promotion[]),
        },
        {
          flag: 'barbers',
          items: seedBarbers,
          empty: barbers.length === 0,
          apply: () => setBarbers(seedBarbers as Barber[]),
        },
        {
          flag: 'plans',
          items: seedPlans,
          empty: plans.length === 0,
          apply: () => setPlans(seedPlans as Plan[]),
        },
        {
          flag: 'rewards',
          items: seedRewards,
          empty: rewards.length === 0,
          apply: () => setRewards(seedRewards as Reward[]),
        },
      ]
      const pending = jobs.filter((j) => j.empty && !meta[j.flag])
      for (const job of pending) {
        for (const item of job.items) await store.add(job.flag, item)
      }
      if (pending.length > 0) {
        await store.setDoc(
          '_meta',
          'seed',
          Object.fromEntries(pending.map((j) => [j.flag, true])),
        )
      }
      if (!cancelled) {
        pending.forEach((j) => j.apply())
      }
    }
    seed()
    return () => {
      cancelled = true
    }
  }, [services.length, products.length, promotions.length, barbers.length, plans.length, rewards.length])

  useEffect(() => {
    const id = localStorage.getItem(CLIENT_KEY)
    if (!id) return
    const found = clients.find((c) => c.id === id)
    setCurrentClient(found ?? null)
  }, [clients])

  useEffect(() => {
    let cancelled = false
    const seed = async () => {
      const meta = (await store.getDoc('_meta', 'seed')) ?? {}
      if (meta.gallery) return
      const existing = await store.list<GalleryImage>('gallery')
      if (existing.length === 0) {
        galleryImages.forEach((img, i) => {
          void store.add('gallery', { src: img.src, title: img.title, category: img.category, order: i })
        })
      }
      if (!cancelled) {
        await store.setDoc('_meta', 'seed', { gallery: true })
      }
    }
    seed()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get('ref')
      if (ref && !localStorage.getItem(CLIENT_KEY)) localStorage.setItem(REF_KEY, ref.toUpperCase())
    } catch {
      /* ignore */
    }
  }, [])

  const awardPoints = useCallback(
    async (client: Client, points: number, reason: string) => {
      if (points === 0) return
      const next = (Number(client.points) || 0) + points
      await store.update('clients', client.id, { points: next })
      await store.add('pointMovements', {
        clientId: client.id,
        clientName: client.name,
        points,
        reason,
        date: new Date().toISOString(),
      })
      setCurrentClient((prev) => (prev?.id === client.id ? { ...prev, points: next } : prev))
    },
    [],
  )

  const registerClient = useCallback(
    async (data: { name: string; phone: string; email: string; cedula: string; birthDate: string }) => {
      const now = new Date().toISOString()
      const id = await store.add('clients', {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        cedula: data.cedula.trim(),
        birthDate: data.birthDate,
        createdAt: now,
        points: 0,
      })
      const referralCode = `EX-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`
      const pendingRef = localStorage.getItem(REF_KEY) || ''
      const referrer = pendingRef ? clients.find((c) => c.referralCode === pendingRef) : undefined
      const bonus = loyalty.signupBonus + (referrer ? loyalty.referredBonus : 0)
      const patch = {
        referralCode,
        referredBy: referrer?.referralCode ?? '',
        points: bonus,
      }
      await store.update('clients', id, patch)
      if (bonus > 0) {
        await store.add('pointMovements', {
          clientId: id,
          clientName: data.name.trim(),
          points: bonus,
          reason: referrer ? 'Bono de bienvenida + referido' : 'Bono de bienvenida',
          date: now,
        })
      }
      if (referrer) {
        await awardPoints(referrer, loyalty.referralBonus, `Referido registrado: ${data.name.trim()}`)
      }
      localStorage.removeItem(REF_KEY)
      localStorage.setItem(CLIENT_KEY, id)
      const client: Client = {
        id,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        cedula: data.cedula.trim(),
        birthDate: data.birthDate,
        createdAt: now,
        ...patch,
      }
      setCurrentClient(client)
      setRegisterModalOpen(false)
      registerCallback?.()
      setRegisterCallback(undefined)
    },
    [registerCallback, clients, loyalty, awardPoints],
  )

  const logoutClient = useCallback(() => {
    localStorage.removeItem(CLIENT_KEY)
    setCurrentClient(null)
  }, [])

  const updateClient = useCallback(
    async (data: { name: string; phone: string; email: string; cedula: string; birthDate: string }) => {
      if (!currentClient) return
      const patch = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        cedula: data.cedula.trim(),
        birthDate: data.birthDate,
      }
      await store.update('clients', currentClient.id, patch)
      setCurrentClient({ ...currentClient, ...patch })
    },
    [currentClient],
  )

  const updateClientById = useCallback(
    async (
      id: string,
      data: { name: string; phone: string; email: string; cedula: string; birthDate: string },
    ) => {
      const patch = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        cedula: data.cedula.trim(),
        birthDate: data.birthDate,
      }
      await store.update('clients', id, patch)
      if (currentClient?.id === id) setCurrentClient({ ...currentClient, ...patch })
    },
    [currentClient],
  )

  const deleteClient = useCallback(async (id: string) => {
    await store.remove('clients', id)
    if (currentClient?.id === id) {
      localStorage.removeItem(CLIENT_KEY)
      setCurrentClient(null)
    }
  }, [currentClient])

  const openRegister = useCallback((callback?: () => void) => {
    setRegisterCallback(callback)
    setRegisterModalOpen(true)
  }, [])

  const recordVisit = useCallback(() => {
    if (sessionStorage.getItem(VISIT_KEY)) return
    sessionStorage.setItem(VISIT_KEY, '1')
    store.add('visits', {
      clientId: currentClient?.id ?? '',
      clientName: currentClient?.name ?? '',
      type: 'visit',
      date: new Date().toISOString(),
    })
    store.statsIncrement('main', 'visits')
    store.statsGet('main').then((s) => {
      setStats({ visits: Number(s.visits) || 0, haircuts: Number(s.haircuts) || 0 })
    })
  }, [currentClient])

  useEffect(() => {
    recordVisit()
  }, [recordVisit])

  const bookHaircut = useCallback(
    async (serviceId: string, date: string, barberId: string, time?: string) => {
      if (!currentClient) return
      const service = services.find((s) => s.id === serviceId)
      const barber = barbers.find((b) => b.id === barberId)
      if (!service) return
      const base = Number(service.price) || 0
      const happy = isHappyHour(date, time, loyalty.happyHour)
      const price = happy ? applyDiscount(base, loyalty.happyHour.discountPct) : base
      await store.add('appointments', {
        clientId: currentClient.id,
        clientName: currentClient.name,
        serviceId: service.id,
        serviceName: service.name,
        price: price.toFixed(2),
        barberId: barber?.id ?? '',
        barberName: barber?.name ?? '',
        date,
        time: time ?? '',
        status: 'pendiente',
        createdBy: 'cliente',
        createdAt: new Date().toISOString(),
      })
    },
    [currentClient, services, barbers, loyalty],
  )

  const bookHaircutAdmin = useCallback(
    async (payload: {
      clientId?: string
      newName?: string
      newPhone?: string
      serviceId: string
      barberId: string
      date: string
      time?: string
    }) => {
      const service = services.find((s) => s.id === payload.serviceId)
      if (!service) return
      const barber = barbers.find((b) => b.id === payload.barberId)
      let clientId = payload.clientId ?? ''
      let clientName = ''
      const existing = clients.find((c) => c.id === payload.clientId)
      if (existing) {
        clientId = existing.id
        clientName = existing.name
      } else if (payload.newName?.trim()) {
        const now = new Date().toISOString()
        const id = await store.add('clients', {
          name: payload.newName.trim(),
          phone: payload.newPhone?.trim() ?? '',
          email: '',
          cedula: '',
          birthDate: '',
          createdAt: now,
          points: 0,
        })
        await store.update('clients', id, {
          referralCode: `EX-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
        })
        clientId = id
        clientName = payload.newName.trim()
      }
      if (!clientId) return
      const base = Number(service.price) || 0
      const happy = isHappyHour(payload.date, payload.time, loyalty.happyHour)
      const price = happy ? applyDiscount(base, loyalty.happyHour.discountPct) : base
      await store.add('appointments', {
        clientId,
        clientName,
        serviceId: service.id,
        serviceName: service.name,
        price: price.toFixed(2),
        barberId: barber?.id ?? '',
        barberName: barber?.name ?? '',
        date: payload.date,
        time: payload.time ?? '',
        status: 'confirmada',
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
      })
    },
    [services, barbers, clients, loyalty],
  )

  const refreshStats = useCallback(async () => {
    const s = await store.statsGet('main')
    setStats({ visits: Number(s.visits) || 0, haircuts: Number(s.haircuts) || 0 })
  }, [])

  const setAppointmentStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      const appt = appointments.find((a) => a.id === id)
      if (!appt) return
      const prev = effectiveStatus(appt)
      if (prev === status) return
      await store.update('appointments', id, { status })
      if (status !== 'completada' || prev === 'completada') return
      const price = Number(appt.price) || 0
      const pts = cutPoints(price, loyalty)
      await store.update('appointments', id, { pointsEarned: pts })
      const client = clients.find((c) => c.id === appt.clientId)
      if (client) {
        await awardPoints(client, pts, `Corte completado: ${appt.serviceName}`)
      }
      await store.add('visits', {
        clientId: appt.clientId,
        clientName: appt.clientName,
        type: 'haircut',
        serviceId: appt.serviceId,
        serviceName: appt.serviceName,
        price: appt.price,
        barberId: appt.barberId ?? '',
        barberName: appt.barberName ?? '',
        date: new Date().toISOString(),
      })
      await store.statsIncrement('main', 'haircuts')
      await refreshStats()
    },
    [appointments, clients, loyalty, awardPoints, refreshStats],
  )

  const deleteAppointment = useCallback(async (id: string) => {
    await store.remove('appointments', id)
  }, [])

  const rateAppointment = useCallback(async (id: string, rating: number) => {
    await store.update('appointments', id, { rating })
  }, [])

  const cutsByClient = useCallback(
    (clientId: string) =>
      appointments.filter(
        (a) => a.clientId === clientId && effectiveStatus(a) === 'completada',
      ).length,
    [appointments],
  )

  const redeemReward = useCallback(
    async (rewardId: string) => {
      const reward = rewards.find((r) => r.id === rewardId && r.active)
      if (!reward || !currentClient) return false
      const pts = Number(currentClient.points) || 0
      if (pts < reward.pointsCost) return false
      const next = pts - reward.pointsCost
      await store.update('clients', currentClient.id, { points: next })
      setCurrentClient((prev) => (prev ? { ...prev, points: next } : prev))
      await store.add('pointMovements', {
        clientId: currentClient.id,
        clientName: currentClient.name,
        points: -reward.pointsCost,
        reason: `Canje: ${reward.name}`,
        date: new Date().toISOString(),
      })
      await store.add('redemptions', {
        clientId: currentClient.id,
        clientName: currentClient.name,
        rewardId: reward.id,
        rewardName: reward.name,
        pointsCost: reward.pointsCost,
        date: new Date().toISOString(),
        fulfilled: false,
      })
      return true
    },
    [rewards, currentClient],
  )

  const adjustClientPoints = useCallback(
    async (clientId: string, delta: number, reason: string) => {
      const client = clients.find((c) => c.id === clientId)
      if (!client || delta === 0) return
      await awardPoints(client, delta, reason)
    },
    [clients, awardPoints],
  )

  const addToCart = useCallback((productId: string) => {
    setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + 1 }))
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((c) => {
      const next = { ...c }
      if ((next[productId] || 0) <= 1) delete next[productId]
      else next[productId] -= 1
      return next
    })
  }, [])

  const clearCart = useCallback(() => setCart({}), [])

  const clearFromCart = useCallback((productId: string) => {
    setCart((c) => {
      const next = { ...c }
      delete next[productId]
      return next
    })
  }, [])

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart])

  const cartTotal = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = products.find((x) => x.id === id)
        return sum + (p ? Number(p.price) * qty : 0)
      }, 0),
    [cart, products],
  )

  const placeOrder = useCallback(async () => {
    if (!currentClient) return
    const items = Object.entries(cart)
      .map(([id, qty]) => {
        const p = products.find((x) => x.id === id)
        return p ? { productId: p.id, name: p.name, price: p.price, qty } : null
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
    if (items.length === 0) return
    const total = items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)
    await store.add('orders', {
      clientId: currentClient.id,
      clientName: currentClient.name,
      phone: currentClient.phone,
      items,
      total: total.toFixed(2),
      createdAt: new Date().toISOString(),
    })
    clearCart()
  }, [cart, currentClient, products, clearCart])

  const isBirthday = currentClient ? getBirthdayToday(currentClient.birthDate) : false

  const value: DataContextValue = {
    cloud,
    services,
    products,
    promotions,
    plans,
    barbers,
    clients,
    orders,
    appointments,
    visits,
    rewards,
    expenses,
    pointMovements,
    redemptions,
    gallery,
    stats,
    currentClient,
    registerModalOpen,
    setRegisterModalOpen,
    openRegister,
    registerClient,
    updateClient,
    updateClientById,
    deleteClient,
    logoutClient,
    isBirthday,
    recordVisit,
    bookHaircut,
    bookHaircutAdmin,
    setAppointmentStatus,
    deleteAppointment,
    rateAppointment,
    cutsByClient,
    redeemReward,
    adjustClientPoints,
    addReward: async (reward) => {
      await store.add('rewards', reward)
    },
    updateReward: async (id, reward) => {
      await store.update('rewards', id, reward)
    },
    deleteReward: async (id) => {
      await store.remove('rewards', id)
    },
    addExpense: async (expense) => {
      await store.add('expenses', expense)
    },
    updateExpense: async (id, expense) => {
      await store.update('expenses', id, expense)
    },
    deleteExpense: async (id) => {
      await store.remove('expenses', id)
    },
    setRedemptionFulfilled: async (id, fulfilled) => {
      await store.update('redemptions', id, { fulfilled })
    },
    cart,
    addToCart,
    removeFromCart,
    clearFromCart,
    clearCart,
    cartCount,
    cartTotal,
    placeOrder,
    addService: async (name, price) => {
      await store.add('services', { name, price })
    },
    updateService: async (id, name, price) => {
      await store.update('services', id, { name, price })
    },
    deleteService: async (id) => {
      await store.remove('services', id)
    },
    addProduct: async (product) => {
      await store.add('products', product)
    },
    updateProduct: async (id, product) => {
      await store.update('products', id, product)
    },
    deleteProduct: async (id) => {
      await store.remove('products', id)
    },
    addPromotion: async (promotion) => {
      await store.add('promotions', promotion)
    },
    updatePromotion: async (id, promotion) => {
      await store.update('promotions', id, promotion)
    },
    deletePromotion: async (id) => {
      await store.remove('promotions', id)
    },
    addPlan: async (plan) => {
      await store.add('plans', plan)
    },
    updatePlan: async (id, plan) => {
      await store.update('plans', id, plan)
    },
    deletePlan: async (id) => {
      await store.remove('plans', id)
    },
    addBarber: async (name) => {
      await store.add('barbers', { name, commissionPct: 30 })
    },
    updateBarber: async (id, data) => {
      await store.update('barbers', id, data)
    },
    deleteBarber: async (id) => {
      await store.remove('barbers', id)
    },
    addGalleryImage: async (image) => {
      await store.add('gallery', { ...image, order: Date.now() })
    },
    updateGalleryImage: async (id, image) => {
      await store.update('gallery', id, image)
    },
    deleteGalleryImage: async (id) => {
      await store.remove('gallery', id)
    },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
