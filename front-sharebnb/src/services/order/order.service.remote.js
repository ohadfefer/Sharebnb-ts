// services/order/order.service.remote.js
import { httpService } from '../http.service'
import { userService } from '../user'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getStayById,
    createOrder,
    updateStatus
}

function query(params) {
    console.log(params)
    return httpService.get('order', params)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function save(order) {
    console.log('Saving order in remote service:', order)
    var savedOrder 
    if (order._id) {
        console.log('Updating existing order:', order._id)
        savedOrder = await httpService.put(`order/${order._id}`, order)
    } else {
        console.log('Creating new order')
        savedOrder = await httpService.post('order', order)
    }
    // console.log('Order saved successfully:', savedOrder)
    return savedOrder
}

async function remove(orderId) {
    return await httpService.delete(`order/${orderId}`)
}

async function updateStatus(orderId, status) {
    try {
        console.log(orderId, status, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        const order = await getById(orderId)
        const updatedOrder = { ...order, status }
        return await save(updatedOrder)
    } catch (err) {
        console.error('Error updating order status:', err)
        throw err
    }
}

async function getStayById(stayId) {
    const { stayService } = await import('../stay')
    return stayService.getById(stayId)
}

async function createOrder(stayId, stayData, overrides = {}) {
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
        } else if (stayData.host?.id) {
            hostId = stayData.host.id
        } else if (stayData.hostId) {
            hostId = stayData.hostId
        } else if (stayData.owner?._id) {
            hostId = stayData.owner._id
        } else if (stayData.ownerId) {
            hostId = stayData.ownerId
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
        const savedOrder = await save(newOrder)
        console.log('Order saved successfully:', savedOrder)
        return savedOrder
    } catch (err) {
        console.error('Error creating order:', err)
        throw err
    }
}

