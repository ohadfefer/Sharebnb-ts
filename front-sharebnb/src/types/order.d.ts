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
    status: string
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

export type OrderAction =
    | { type: typeof SET_IS_LOADING; isLoading: boolean }
    | { type: typeof SET_FILTER_BY; filterBy: OrderFilterBy }
    | { type: typeof SET_ORDERS; orders: Order[] }
    | { type: typeof SET_ORDER; order: Order }
    | { type: typeof ADD_ORDER; order: Order }
    | { type: typeof UPDATE_ORDER; order: Order }
    | { type: typeof REMOVE_ORDER; orderId: string }
    | { type: typeof ADD_ORDER_MSG; orderId: string; msg: OrderMsg }

