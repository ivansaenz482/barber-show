export type ProductCategory = 'ropa' | 'perfume' | 'accesorio'

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

export interface Barber {
  id: string
  name: string
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  cedula: string
  birthDate: string
  createdAt: string
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
  createdAt: string
}
