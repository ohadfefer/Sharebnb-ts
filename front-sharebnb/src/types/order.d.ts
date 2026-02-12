import { AggregateOrder as OrderBackend } from "../../../back-sharebnb/types/order.js"
import { ADD_ORDER, ADD_ORDER_MSG, REMOVE_ORDER, SET_FILTER_BY, SET_IS_LOADING, SET_ORDER, SET_ORDERS, UPDATE_ORDER } from "../store/reducers/order.reducer.js"

export interface Order {
    _id?: string
    userId: string
    stayId: string
    hostId: string
    totalPrice: number
    startDate: Date | string
    endDate: Date | string
    guests: {
        adults: number
        children: number
    }
    status: OrderStatus
    createdAt?: Date | string
    contactEmail?: string | null
    emails?: Record<string, any>
}

export interface OrderFilterBy {
    hostId?: string
    userId?: string
    guestId?: string
    status?: string
}

export interface OrderMsg {
    id: string
    txt: string
    by: { _id: string; fullname: string; imgUrl?: string }
}

export interface OccupancyDay {
    label: string;   // e.g. "Jul 15"
    occ: 0 | 1;
}

export interface LeadTimeBucket {
    name: '0-3d' | '4-7d' | '8-14d' | '15-30d' | '30d+';
    v: number;
}

export interface RevenueEntry {
    name: string;
    total: number;
}

export type OrderAction =
    | { type: typeof SET_IS_LOADING; isLoading: boolean }
    | { type: typeof SET_FILTER_BY; filterBy: OrderFilterBy }
    | { type: typeof SET_ORDERS; orders: OrderBackend[] }
    | { type: typeof SET_ORDER; order: OrderBackend }
    | { type: typeof ADD_ORDER; order: OrderBackend }
    | { type: typeof UPDATE_ORDER; order: OrderBackend }
    | { type: typeof REMOVE_ORDER; orderId: string }
    | { type: typeof ADD_ORDER_MSG; orderId: string; msg: OrderMsg }


