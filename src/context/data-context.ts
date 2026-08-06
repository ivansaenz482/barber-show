import { createContext, useContext } from 'react'
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

export interface Stats {
  visits: number
  haircuts: number
}

export interface DataContextValue {
  cloud: boolean
  services: Service[]
  products: Product[]
  promotions: Promotion[]
  barbers: Barber[]
  clients: Client[]
  orders: Order[]
  appointments: Appointment[]
  visits: Visit[]
  stats: Stats
  currentClient: Client | null
  registerModalOpen: boolean
  setRegisterModalOpen: (open: boolean) => void
  openRegister: (callback?: () => void) => void
  registerClient: (data: {
    name: string
    phone: string
    email: string
    cedula: string
    birthDate: string
  }) => Promise<void>
  updateClient: (data: {
    name: string
    phone: string
    email: string
    cedula: string
    birthDate: string
  }) => Promise<void>
  updateClientById: (
    id: string,
    data: {
      name: string
      phone: string
      email: string
      cedula: string
      birthDate: string
    },
  ) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  logoutClient: () => void
  isBirthday: boolean
  recordVisit: () => void
  bookHaircut: (serviceId: string, date: string, barberId: string) => Promise<void>
  cart: Record<string, number>
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearFromCart: (productId: string) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  placeOrder: () => Promise<void>
  addService: (name: string, price: string) => Promise<void>
  updateService: (id: string, name: string, price: string) => Promise<void>
  deleteService: (id: string) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addPromotion: (promotion: Omit<Promotion, 'id'>) => Promise<void>
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<void>
  deletePromotion: (id: string) => Promise<void>
  addBarber: (name: string) => Promise<void>
  updateBarber: (id: string, name: string) => Promise<void>
  deleteBarber: (id: string) => Promise<void>
}

export const DataContext = createContext<DataContextValue | undefined>(undefined)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider')
  return ctx
}
