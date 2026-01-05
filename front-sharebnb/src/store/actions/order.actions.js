import { orderService } from '../../services/order'
import { store } from '../store'
import { socketService } from '../../services/socket.service'
import { SOCKET_EVENT_ORDER_UPDATED } from '../../services/socket.service'
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

export async function loadOrders() {
    const { filterBy } = store.getState().orderModule

    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        console.log('loadOrders -> filterBy:', filterBy)
        const orders = await orderService.query(filterBy)
        console.log('loadOrders -> orders returned:', orders.length, 'orders')
        console.log('loadOrders -> orders details:', orders)

        store.dispatch({ type: SET_ORDERS, orders })
        return orders
    } catch (err) {
        console.log('order action -> Cannot load orders')
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function removeOrder(orderId) {
    try {
        await orderService.remove(orderId)
        store.dispatch(getCmdRemoveOrder(orderId))
    } catch (err) {
        console.log('Cannot remove order', err)
        throw err
    }
}

export async function addOrder(order) {
    try {
        const savedOrder = await orderService.save(order)
        store.dispatch(getCmdAddOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot add order', err)
        throw err
    }
}

export async function updateOrder(order) {
    try {
        console.log('Updating order in actions:', order)
        const savedOrder = await orderService.save(order)
        console.log('Order updated successfully:', savedOrder)
        store.dispatch(getCmdUpdateOrder(savedOrder))
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

export async function updateOrderStatus(orderId, nextStatus) {
    try {
        const updatedOrder = await orderService.updateStatus(orderId, nextStatus)
        store.dispatch({ type: UPDATE_ORDER, order: updatedOrder })
        return updatedOrder
    } catch (err) {
        console.log('Cannot update order status', err)
        throw err
    }
}

export async function addOrderMsg(orderId, txt) {
    const msg = await orderService.addOrderMsg(orderId, txt)
    if (msg) store.dispatch({ type: ADD_ORDER_MSG, orderId, msg })
    return msg
}


export function setFilter(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

// Socket event handler for real-time order updates
export function handleOrderUpdate(updatedOrder) {
    console.log('Received order update via socket:', updatedOrder)
    store.dispatch({ type: UPDATE_ORDER, order: updatedOrder })
}

// Set up socket listeners for order updates
export function setupOrderSocketListeners() {
    socketService.on(SOCKET_EVENT_ORDER_UPDATED, handleOrderUpdate)
}

// Clean up socket listeners
export function cleanupOrderSocketListeners() {
    socketService.off(SOCKET_EVENT_ORDER_UPDATED, handleOrderUpdate)
}


export function getCmdSetOrders(orders) {
    return {
        type: SET_ORDERS,
        orders
    }
}
export function getCmdSetOrder(order) {
    return {
        type: SET_ORDER,
        order
    }
}
export function getCmdRemoveOrder(orderId) {
    return {
        type: REMOVE_ORDER,
        orderId
    }
}
export function getCmdAddOrder(order) {
    return {
        type: ADD_ORDER,
        order
    }
}
export function getCmdUpdateOrder(order) {
    return {
        type: UPDATE_ORDER,
        order
    }
}
export function getCmdAddOrderMsg(msg) {
    return {
        type: ADD_ORDER_MSG,
        msg
    }
}

async function unitTestActions() {
    await loadOrders()
    await addOrder(orderService.getEmptyOrder())
    await updateOrder({
        _id: 'eQXRn',
        name: 'Order-Good',
        price: 333
    })

}
