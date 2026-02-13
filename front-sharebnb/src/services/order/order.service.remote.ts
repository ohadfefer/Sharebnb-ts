// services/order/order.service.remote.ts
import { httpService } from '../http.service.js'
import { userService } from '../user/index.js'
import { Order, OrderFilterBy } from '../../types/order.js'
import { AggregateOrder, Order as OrderBackend } from '../../../../back-sharebnb/types/order.js'

//types
import { Stay } from '../../types/stay.js'
import { OrderStatus } from '../../types/global.js'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getStayById,
    createOrder,
    updateStatus
}

function query(params: OrderFilterBy): Promise<AggregateOrder[]> {
    console.log('filter orders in backend --->', params)
    return httpService.get<AggregateOrder[]>('order', params)
}

function getById(orderId: string): Promise<OrderBackend> {
    return httpService.get<OrderBackend>(`order/${orderId}`)
}

async function save(order: Order): Promise<AggregateOrder> {
    console.log('Saving order in remote service:', order)
    var savedOrder: AggregateOrder
    if (order._id) {
        console.log('Updating existing order:', order._id)
        savedOrder = await httpService.put<AggregateOrder>(`order/${order._id}`, order)
    } else {
        console.log('Creating new order')
        savedOrder = await httpService.post<AggregateOrder>('order', order)
    }
    // console.log('Order saved successfully:', savedOrder)
    return savedOrder
}

async function remove(orderId: string): Promise<void> {
    return await httpService.delete<void>(`order/${orderId}`)
}

async function updateStatus(orderId: string, status: OrderStatus): Promise<AggregateOrder> {
    try {
        console.log(orderId, status, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        const order = await getById(orderId)
        const updatedOrder: Order = { ...order, status }
        
        return await save(updatedOrder)
    } catch (err) {
        console.error('Error updating order status:', err)
        throw err
    }
}

async function getStayById(stayId: string): Promise<Stay> {
    const { stayService } = await import('../stay/index.js')
    return stayService.getById(stayId)
}

async function createOrder(
    stayId: string,
    stayData: Stay,
    overrides: Partial<Order> = {}
): Promise<AggregateOrder> {
    try {
        // Get current user
        // const { userService } = await import('../user')
        const loggedInUser = userService.getLoggedinUser()

        console.log('Creating order with:', { stayId, stayData, overrides, loggedInUser })

        // Handle guest mode - if no user is logged in, use a default guest user ID
        const userId = loggedInUser?._id || 'guest-user-id'

        if (!stayId) {
            throw new Error('Stay ID is required')
        }

        if (!stayData) {
            throw new Error('Stay data is required')
        }

        // Extract hostId from various possible locations in stayData
        let hostId = null
        if (stayData.host?._id) {
            hostId = stayData.host._id
        } else if (loggedInUser?._id) {
            // If no host found, assume the current user is the host (for user-created listings)
            hostId = loggedInUser._id
        } else {
            // Last resort fallback
            hostId = 'u102'
        }

        console.log('Extracted hostId:', hostId, 'from stayData:', stayData)

        const newOrder = {
            userId: userId,
            stayId: stayId,
            hostId: hostId,
            totalPrice: overrides.totalPrice || stayData?.price || 205.33,
            startDate: overrides.startDate || new Date().toISOString(),
            endDate: overrides.endDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            guests: overrides.guests || {
                adults: 1,
                children: 0,
                infants: 0,
                pets: 0
            },
            status: overrides.status || 'pending',
            createdAt: new Date().toISOString()
        }

        console.log('Saving order:', newOrder)
        const savedOrder = await save(newOrder as Order)
        console.log('Order saved successfully:', savedOrder)
        return savedOrder
    } catch (err) {
        console.error('Error creating order:', err)
        throw err
    }
}

