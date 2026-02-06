// Type definitions for Stay-related entities
import type { Order, OrderFilterBy } from './order.js'
import type { AggregateOrder, Order as OrderBackend } from '../../../back-sharebnb/types/order.js'
import { StayFilterBy, Stay } from './stay.js'
import type { User as UserBackend } from '../../../back-sharebnb/types/user.d.ts'
import type { LoggedInUser, SignupCredentials } from '../types/user.d.ts'

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


interface UserServiceRemote {
  login(userCred: Partial<UserBackend>): Promise<LoggedInUser | undefined>
  logout(): any
  signup(userCred: SignupCredentials): Promise<LoggedInUser> 
  getUsers(): Promise<UserBackend[]>
  getById(userId: string): Promise<UserBackend>
  remove(userId: string): any
  update({ _id }: Partial<UserBackend>): Promise<UserBackend>
  getLoggedinUser(): LoggedInUser | null
  saveLoggedinUser<T>(user: T): T 
}

interface UserService extends UserServiceRemote {
  getEmptyUser(): Partial<SignupCredentials>
}


type OrderStatus = "pending" | "approved" | "completed" | "rejected"

declare global {
  interface Window {
    stayService?: StayService  // ← use ? if it's optional / only in dev
    orderService?: OrderService
    userService?: UserService
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => any
  }
}
