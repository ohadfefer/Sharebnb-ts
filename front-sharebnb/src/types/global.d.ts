// Type definitions for Stay-related entities
import type { Order, OrderFilterBy } from './order.js'
import type { AggregateOrder, Order as OrderBackend } from '../../../back-sharebnb/types/order.js'

interface Guests {
  adults: number | string
  children: number | string
  infants: number | string
  pets: number | string
}

interface StayFilterBy {
  address: string
  maxPrice: string
  checkIn: string
  checkOut: string
  guests: Guests | string | number
  labels: string[]
}

interface Host {
  _id: string
  fullname: string
  location: string
  about: string
  responseTime: string
  isSuperhost: boolean
  pictureUrl: string
}

interface Location {
  country: string
  countryCode: string
  city: string
  address: string
  lat: number
  lng: number
}

interface Review {
  at: string
  by: { fullname: string; imgUrl: string; id: string }
  txt: string
  _id?: string
}

interface AvailableDate {
  start: string
  end: string
}

interface StayMsg {
  id: string
  txt: string
  by: { _id: string; fullname: string; imgUrl?: string }
}

interface Stay {
  _id?: string
  name: string
  type: string
  imgUrls: string[]
  price: number
  summary: string
  capacity: number
  amenities: string[]
  bathrooms: number
  bedrooms: number
  roomType: string
  host?: Host
  loc?: Location
  reviews?: Review[] | string
  likedByUsers?: any
  availableDates?: AvailableDate[]
  labels: string[]
  msgs?: StayMsg[]
  rating?: string | number
  guestFavorit?: boolean
  isGuestFavorite?: boolean
  wishlist?: { userId: string; addedAt: string }[]
}

interface StayServiceRemote {
  query(filterBy: StayFilterBy): Promise<Stay[]>
  getById(stayId: string): Promise<Stay>
  save(stay: Stay): Promise<Stay>
  remove(stayId: string): Promise<void>
  addStayMsg(stayId: string, txt: string): Promise<any>
  addToWishlist(stayId: string, userId: string): Promise<Stay>
  removeFromWishlist(stayId: string, userId: string): Promise<Stay>
  getWishlistStays(userId: string): Promise<Stay[]>
}

interface StayService extends StayServiceRemote {
  getDefaultFilter(): StayFilterBy
}

// Order service types
interface OrderServiceRemote {
  query(params: OrderFilterBy): Promise<AggregateOrder[]>
  getById(orderId: string): Promise<OrderBackend>
  save(order: Order): Promise<AggregateOrder>
  remove(orderId: string): Promise<void>
  getStayById(stayId: string): Promise<Stay>
  createOrder(stayId: string, stayData: Stay, overrides?: Partial<Order>): Promise<AggregateOrder>
  updateStatus(orderId: string, status: string): Promise<AggregateOrder>
}

interface OrderService extends OrderServiceRemote {
  getEmptyOrder(): Partial<Order>
  getDefaultFilter(): OrderFilterBy
}

declare global {
  interface Window {
    stayService?: StayService  // ← use ? if it's optional / only in dev
    orderService?: OrderService
  }
}

export { StayService, StayServiceRemote, Stay, StayFilterBy, Guests, Host, Location, Review, AvailableDate, StayMsg, OrderService, OrderServiceRemote }  // important: makes this a module (otherwise TS treats it as ambient)