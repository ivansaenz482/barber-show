import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { store } from '../lib/store'
import type {
  Appointment,
  Barber,
  Client,
  Order,
  Product,
  Promotion,
  Service,
  Visit,
} from '../lib/types'
import { DataContext, type DataContextValue, type Stats } from './data-context'

const CLIENT_KEY = 'exclusive_client_id'
const CART_KEY = 'exclusive_cart'
const VISIT_KEY = 'exclusive_visit_counted'

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23072d25"/%3E%3Ctext x="200" y="150" fill="%2314b8a6" font-size="22" text-anchor="middle" font-family="Arial"%3EAgrega tu foto%3C/text%3E%3C/svg%3E'

const seedServices: Omit<Service, 'id'>[] = [
  { name: 'Corte Clásico', price: '12' },
  { name: 'Fade Moderno', price: '15' },
  { name: 'Perfilado de Barba', price: '10' },
  { name: 'Corte Infantil', price: '8' },
  { name: 'Ritual Premium', price: '20' },
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
  { name: 'Barbero 1' },
  { name: 'Barbero 2' },
  { name: 'Barbero 3' },
]

function getBirthdayToday(birthDate: string) {
  if (!birthDate) return false
  const now = new Date()
  const [y, m, d] = birthDate.split('-').map(Number)
  if (!y || !m || !d) return false
  return now.getMonth() + 1 === m && now.getDate() === d
}

export default function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [visits, setVisits] = useState<Visit[]>([])
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
      store.subscribe<Barber>('barbers', setBarbers),
      store.subscribe<Client>('clients', setClients),
      store.subscribe<Order>('orders', setOrders),
      store.subscribe<Appointment>('appointments', setAppointments),
      store.subscribe<Visit>('visits', setVisits),
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
  }, [services.length, products.length, promotions.length, barbers.length])

  useEffect(() => {
    const id = localStorage.getItem(CLIENT_KEY)
    if (!id) return
    const found = clients.find((c) => c.id === id)
    setCurrentClient(found ?? null)
  }, [clients])

  const registerClient = useCallback(
    async (data: { name: string; phone: string; email: string; cedula: string; birthDate: string }) => {
      const id = await store.add('clients', {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        cedula: data.cedula.trim(),
        birthDate: data.birthDate,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem(CLIENT_KEY, id)
      const client: Client = {
        id,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        cedula: data.cedula.trim(),
        birthDate: data.birthDate,
        createdAt: new Date().toISOString(),
      }
      setCurrentClient(client)
      setRegisterModalOpen(false)
      registerCallback?.()
      setRegisterCallback(undefined)
    },
    [registerCallback],
  )

  const logoutClient = useCallback(() => {
    localStorage.removeItem(CLIENT_KEY)
    setCurrentClient(null)
  }, [])

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
    async (serviceId: string, date: string, barberId: string) => {
      if (!currentClient) return
      const service = services.find((s) => s.id === serviceId)
      const barber = barbers.find((b) => b.id === barberId)
      if (!service) return
      await store.add('appointments', {
        clientId: currentClient.id,
        clientName: currentClient.name,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        barberId: barber?.id ?? '',
        barberName: barber?.name ?? '',
        date,
        createdAt: new Date().toISOString(),
      })
      await store.add('visits', {
        clientId: currentClient.id,
        clientName: currentClient.name,
        type: 'haircut',
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        barberId: barber?.id ?? '',
        barberName: barber?.name ?? '',
        date: new Date().toISOString(),
      })
      await store.statsIncrement('main', 'haircuts')
      const s = await store.statsGet('main')
      setStats({ visits: Number(s.visits) || 0, haircuts: Number(s.haircuts) || 0 })
    },
    [currentClient, services, barbers],
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
    barbers,
    clients,
    orders,
    appointments,
    visits,
    stats,
    currentClient,
    registerModalOpen,
    setRegisterModalOpen,
    openRegister,
    registerClient,
    logoutClient,
    isBirthday,
    recordVisit,
    bookHaircut,
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
    deletePromotion: async (id) => {
      await store.remove('promotions', id)
    },
    addBarber: async (name) => {
      await store.add('barbers', { name })
    },
    updateBarber: async (id, name) => {
      await store.update('barbers', id, { name })
    },
    deleteBarber: async (id) => {
      await store.remove('barbers', id)
    },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
