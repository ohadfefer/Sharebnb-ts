import { Request, Response } from 'express'
import { logger } from '../../services/logger.service.js'
import { orderService } from './order.service.js'
import { socketService } from '../../services/socket.service.js'
import { Order, OrderFilterBy, AggregateOrder } from '../../types/order.js'
import { AuthenticatedRequest } from '../../types/express.js'

export async function getOrders(req: Request, res: Response) {
	try {
		const filterBy: OrderFilterBy = {
			hostId: (req.query.hostId as string) || '',
			userId: (req.query.userId as string) || '',
			guestId: (req.query.guestId as string) || '',
			status: (req.query.status as string) || '',
		}
		logger.info('getOrders -> req.query:', filterBy)

		const orders: AggregateOrder[] = await orderService.query(filterBy)
		res.json(orders)
	} catch (err: any) {
		logger.error('Failed to get orders - full error:', err)
		logger.error('Failed to get orders - error message:', err.message)
		logger.error('Failed to get orders - error stack:', err.stack)
		res.status(400).send({ err: 'Failed to get orders: ' + err.message })
	}
}

export async function getOrderById(req: Request, res: Response) {
	try {
		const orderId = req.params.id as string
		const order: Order = await orderService.getById(orderId)
		res.json(order)
	} catch (err) {
		logger.error('Failed to get order', err)
		res.status(400).send({ err: 'Failed to get order' })
	}
}

export async function addOrder(req: AuthenticatedRequest, res: Response) {
	const { loggedinUser, body: order } = req

	console.log('Adding order:', { loggedinUser, order })
	console.log('Order userId:', order.userId)
	console.log('Order hostId:', order.hostId)
	console.log('Logged in user _id:', loggedinUser?._id)

	try {
		const orderToAdd: Order = {
			userId: order.userId,
			stayId: order.stayId,
			hostId: order.hostId,
			totalPrice: order.totalPrice,
			startDate: new Date(order.startDate),
			endDate: new Date(order.endDate),
			guests: order.guests,
			status: order.status || 'pending',
			emails: order.emails || {},
			contactEmail: loggedinUser?.email || order.contactEmail || null,
		}

		console.log('Order to add:', orderToAdd)

		const addedOrder: Order = await orderService.add(orderToAdd)
		console.log('Order added successfully:', addedOrder)

		res.json(addedOrder)
	} catch (err: any) {
		logger.error('Failed to add order', err)
		console.error('Error adding order:', err)
		res.status(400).send({ err: 'Failed to add order: ' + err.message })
	}
}

export async function updateOrder(req: AuthenticatedRequest, res: Response) {
	console.log('=== UPDATE ORDER FUNCTION CALLED ===')
	console.log('Request method:', req.method)
	console.log('Request URL:', req.url)
	console.log('Request params:', req.params)
	console.log('Request body:', req.body)
	console.log('Request headers:', req.headers)

	const { loggedinUser, body: order } = req

	console.log('=== ORDER UPDATE REQUEST ===')
	console.log('Updating order:', { loggedinUser, order })
	console.log('Order hostId:', order.hostId, 'Type:', typeof order.hostId)
	console.log('Logged in user _id:', loggedinUser?._id, 'Type:', typeof loggedinUser?._id)
	console.log('Comparison result:', order.hostId !== loggedinUser?._id)
	console.log('Order status:', order.status)
	console.log('=== END ORDER UPDATE REQUEST ===')

	if (!loggedinUser || order.hostId !== loggedinUser._id) {
		console.log('Access denied - not your order')
		res.status(403).send('Not your order...')
		return
	}

	try {
		const updatedOrder: AggregateOrder = await orderService.update(order)
		console.log('=== ORDER UPDATE SUCCESS ===')
		console.log('Order updated successfully:', updatedOrder)
		console.log('Updated order status:', updatedOrder.status)
		console.log('Updated order userId:', updatedOrder.guest._id)
		console.log('Updated order hostId:', updatedOrder.host?._id)

		if (updatedOrder.status && (updatedOrder.status === 'approved' || updatedOrder.status === 'rejected')) {
			console.log('=== EMITTING SOCKET EVENTS ===')
			console.log('Emitting socket events for order status change:', {
				orderId: updatedOrder._id,
				status: updatedOrder.status,
				userId: updatedOrder.guest._id,
				hostId: updatedOrder.host?._id
			})

			console.log('Emitting socket events')

			console.log('Emitting to user:', updatedOrder.guest._id.toString())
			socketService.emitToUser({
				type: 'order-updated',
				data: updatedOrder,
				userId: updatedOrder.guest._id.toString()
			})

			if (updatedOrder.host) {
				console.log('Emitting to host:', updatedOrder.host._id.toString())
				socketService.emitToUser({
					type: 'order-updated',
					data: updatedOrder,
					userId: updatedOrder.host._id.toString()
				})
			}

			logger.info(`Order status updated to ${updatedOrder.status} for order ${updatedOrder._id}`)
			console.log('=== SOCKET EVENTS EMITTED ===')
		} else {
			console.log('No socket emission - status not approved/rejected:', updatedOrder.status)
		}

		res.json(updatedOrder)
	} catch (err: any) {
		logger.error('Failed to update order', err)
		console.error('Error updating order:', err)
		res.status(400).send({ err: 'Failed to update order: ' + err.message })
	}
}

export async function removeOrder(req: Request, res: Response) {
	try {
		const orderId = req.params.id as string
		await orderService.remove(orderId)
		res.send({ msg: 'Order removed successfully' })
	} catch (err) {
		logger.error('Failed to remove order', err)
		res.status(400).send({ err: 'Failed to remove order' })
	}
}

export async function testSocket(req: Request, res: Response) {
	try {
		const { userId } = req.query
		console.log('Testing socket emission to user:', userId)

		socketService.emitToUser({
			type: 'order-updated',
			data: { test: true, message: 'Socket test successful' },
			userId: userId as string
		})

		res.json({ success: true, message: 'Socket test sent' })
	} catch (err) {
		logger.error('Socket test failed', err)
		res.status(400).send({ err: 'Socket test failed' })
	}
}
