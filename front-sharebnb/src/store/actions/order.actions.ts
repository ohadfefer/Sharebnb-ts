import { orderService } from '../../services/order/index.js'
import { store } from '../store.js'
import { socketService } from '../../services/socket.service.js'
import { SOCKET_EVENT_ORDER_UPDATED } from '../../services/socket.service.js'
import { Order, OrderAction, OrderFilterBy, OrderMsg } from '../../types/order.js'
import { AggregateOrder as OrderBackend } from '../../../../back-sharebnb/types/order.js'
import {
    ADD_ORDER,
    REMOVE_ORDER,
    SET_ORDERS,
    SET_ORDER,
    UPDATE_ORDER,
    ADD_ORDER_MSG,
    SET_FILTER_BY,
    SET_IS_LOADING,
} from '../reducers/order.reducer.js'

// types
import { OrderStatus } from '../../types/global.js'

type Dispatch = (action: OrderAction) => void

export async function loadOrders(filterBy: Partial<OrderFilterBy>): Promise<OrderBackend[]> {
    // const { filterBy } = store.getState().orderModule

    try {
        (store.dispatch as Dispatch)({ type: SET_IS_LOADING, isLoading: true })
        console.log('loadOrders -> filterBy:', filterBy)
        const orders = await orderService.query(filterBy as OrderFilterBy) as OrderBackend[]
        // console.log('loadOrders -> orders returned:', orders.length, 'orders')
        // console.log('loadOrders -> orders details:', orders)

        console.log('orders returned from backend:', orders);
        (store.dispatch as Dispatch)({ type: SET_ORDERS, orders })
        console.log('orders deployed in order reducer:', orders)
        return orders
    } catch (err) {
        console.log('order action -> Cannot load orders')
        throw err
    } finally {
        (store.dispatch as Dispatch)({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeOrder(orderId: string): Promise<void> {
    try {
        await orderService.remove(orderId) as void
        (store.dispatch as Dispatch)(getCmdRemoveOrder(orderId))
    } catch (err) {
        console.log('Cannot remove order', err)
        throw err
    }
}

export async function addOrder(order: Order): Promise<OrderBackend> {
    try {
        const savedOrder = await orderService.save(order) as OrderBackend
        (store.dispatch as Dispatch)(getCmdAddOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot add order', err)
        throw err
    }
}

export async function updateOrder(order: Order): Promise<OrderBackend> {
    try {
        console.log('Updating order in actions:', order)
        const savedOrder = await orderService.save(order) as OrderBackend
        // console.log('Order updated successfully:', savedOrder)
        (store.dispatch as Dispatch)(getCmdUpdateOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot save order', err)
        throw err
    }
}

// export async function addOrderMsg(orderId, txt) {
//     try {
//         const msg = await orderService.addOrderMsg(orderId, txt)
//         store.dispatch(getCmdAddOrderMsg(msg))
//         return msg
//     } catch (err) {
//         console.log('Cannot add order msg', err)
//         throw err
//     }
// }

export async function updateOrderStatus(orderId: string, nextStatus: OrderStatus): Promise<OrderBackend> {
    try {
        const updatedOrder = await orderService.updateStatus(orderId, nextStatus) as OrderBackend
        (store.dispatch as Dispatch)({ type: UPDATE_ORDER, order: updatedOrder })
        return updatedOrder
    } catch (err) {
        console.log('Cannot update order status', err)
        throw err
    }
}

// export async function addOrderMsg(orderId: string, txt: string): Promise<OrderMsg | null> {
//     const msg = await orderService.addOrderMsg(orderId, txt) as OrderMsg | null
//     if (msg) {
//         (store.dispatch as Dispatch)({ type: ADD_ORDER_MSG, orderId, msg })
//     }
//     return msg
// }


export function setFilter(filterBy: OrderFilterBy): void {
    (store.dispatch as Dispatch)({ type: SET_FILTER_BY, filterBy })
}

// Socket event handler for real-time order updates
export function handleOrderUpdate(updatedOrder: OrderBackend): void {
    // console.log('Received order update via socket:', updatedOrder)
    (store.dispatch as Dispatch)({ type: UPDATE_ORDER, order: updatedOrder })
}

// Set up socket listeners for order updates
export function setupOrderSocketListeners() {
    (socketService as any).on(SOCKET_EVENT_ORDER_UPDATED, handleOrderUpdate)
}

// Clean up socket listeners
export function cleanupOrderSocketListeners() {
    (socketService as any).off(SOCKET_EVENT_ORDER_UPDATED, handleOrderUpdate)
}


export function getCmdSetOrders(orders: OrderBackend[]): OrderAction {
    return {
        type: SET_ORDERS,
        orders
    }
}
export function getCmdSetOrder(order: OrderBackend): OrderAction {
    return {
        type: SET_ORDER,
        order
    }
}
export function getCmdRemoveOrder(orderId: string): OrderAction {
    return {
        type: REMOVE_ORDER,
        orderId
    }
}
export function getCmdAddOrder(order: OrderBackend): OrderAction {
    return {
        type: ADD_ORDER,
        order
    }
}
export function getCmdUpdateOrder(order: OrderBackend): OrderAction {
    return {
        type: UPDATE_ORDER,
        order
    }
}
export function getCmdAddOrderMsg(orderId: string, msg: OrderMsg): OrderAction {
    return {
        type: ADD_ORDER_MSG,
        orderId,
        msg,
    }
}

// async function unitTestActions() {
//     await loadOrders()
// }
