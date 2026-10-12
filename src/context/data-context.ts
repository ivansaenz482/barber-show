import { createContext, useContext } from 'react'
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

export interface Stats {
  visits: number
  haircuts: number
}

export interface DataContextValue {
  cloud: boolean
  services: Service[]
  products: Product[]
  promotions: Promotion[]
  plans: Plan[]
  barbers: Barber[]
  clients: Client[]
  orders: Order[]
  appointments: Appointment[]
  visits: Visit[]
  rewards: Reward[]
  expenses: Expense[]
  pointMovements: PointMovement[]
  redemptions: Redemption[]
  gallery: GalleryImage[]
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
  bookHaircut: (serviceId: string, date: string, barberId: string, time?: string) => Promise<void>
  bookHaircutAdmin: (payload: {
    clientId?: string
    newName?: string
    newPhone?: string
    serviceId: string
    barberId: string
    date: string
    time?: string
  }) => Promise<void>
  setAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  rateAppointment: (id: string, rating: number) => Promise<void>
  cutsByClient: (clientId: string) => number
  redeemReward: (rewardId: string) => Promise<boolean>
  adjustClientPoints: (clientId: string, delta: number, reason: string) => Promise<void>
  addReward: (reward: Omit<Reward, 'id'>) => Promise<void>
  updateReward: (id: string, reward: Partial<Reward>) => Promise<void>
  deleteReward: (id: string) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  setRedemptionFulfilled: (id: string, fulfilled: boolean) => Promise<void>
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
  addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>
  deletePlan: (id: string) => Promise<void>
  addBarber: (name: string) => Promise<void>
  updateBarber: (id: string, data: { name: string; commissionPct?: number }) => Promise<void>
  deleteBarber: (id: string) => Promise<void>
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => Promise<void>
  updateGalleryImage: (id: string, image: Partial<GalleryImage>) => Promise<void>
  deleteGalleryImage: (id: string) => Promise<void>
}

export const DataContext = createContext<DataContextValue | undefined>(undefined)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider')
  return ctx
}
