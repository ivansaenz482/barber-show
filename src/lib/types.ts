export type ProductCategory = 'ropa' | 'perfume' | 'accesorio'

export type Category = 'barberia' | 'cortes' | 'adultos' | 'jovenes'

export interface GalleryImage {
  id: string
  src: string
  title: string
  category: Category
  order?: number
}

export interface Service {
  id: string
  name: string
  price: string
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: string
  image: string
  description: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  image: string
}

export interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  featured: boolean
}

export interface Barber {
  id: string
  name: string
  commissionPct?: number
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  cedula: string
  birthDate: string
  createdAt: string
  points?: number
  referralCode?: string
  referredBy?: string
  referralAwarded?: boolean
}

export interface OrderItem {
  productId: string
  name: string
  price: string
  qty: number
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  phone: string
  items: OrderItem[]
  total: string
  createdAt: string
}

export interface Visit {
  id: string
  clientId: string
  clientName: string
  type: 'visit' | 'haircut'
  serviceId?: string
  serviceName?: string
  price?: string
  barberId?: string
  barberName?: string
  date: string
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'ausente' | 'cancelada'

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  serviceId: string
  serviceName: string
  price: string
  barberId?: string
  barberName?: string
  date: string
  time?: string
  status?: AppointmentStatus
  createdBy?: 'cliente' | 'admin'
  pointsEarned?: number
  rating?: number
  createdAt: string
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  active: boolean
}

export type ExpenseCategory = 'alquiler' | 'insumos' | 'servicios' | 'sueldos' | 'equipos' | 'otros'

export interface Expense {
  id: string
  concept: string
  category: ExpenseCategory
  amount: string
  date: string
  notes?: string
}

export interface PointMovement {
  id: string
  clientId: string
  clientName: string
  points: number
  reason: string
  date: string
}

export interface Redemption {
  id: string
  clientId: string
  clientName: string
  rewardId: string
  rewardName: string
  pointsCost: number
  date: string
  fulfilled: boolean
}
