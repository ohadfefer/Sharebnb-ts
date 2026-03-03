import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { Order, OrderFilterBy, AggregateOrder } from '../../types/order.js'

const COLLECTION_NAME = 'order'

export const orderService = {
	query,
	getById,
	add,
	update,
	remove,
}

function _asObjectId(id: string | ObjectId | null | undefined): ObjectId | null {
	if (!id) return null
	if (id instanceof ObjectId) return id
	try {
		return ObjectId.isValid(String(id)) ? new ObjectId(String(id)) : null
	} catch {
		return null
	}
}

function _buildCriteria(filterBy: OrderFilterBy): Record<string, any> {
	const criteria: Record<string, any> = {}
	// console.log('_buildCriteria -> filterBy:', filterBy)

	if (filterBy.hostId) {
		// console.log('Adding hostId filter:', filterBy.hostId)
		criteria.hostId = ObjectId.createFromHexString(filterBy.hostId)
	}
	if (filterBy.userId) {
		// console.log('Adding userId filter:', filterBy.userId)
		criteria.userId = ObjectId.createFromHexString(filterBy.userId)
	}
	if (filterBy.status) {
		// console.log('Adding status filter:', filterBy.status)
		criteria.status = filterBy.status
	}

	// console.log('_buildCriteria -> final criteria:', criteria)
	return criteria
}

async function query(filterBy: OrderFilterBy): Promise<AggregateOrder[]> {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection(COLLECTION_NAME)

	const orders: AggregateOrder[] = await collection
		.aggregate([
			{
				$match: criteria,
			},
			{
				$lookup: {
					from: 'user',
					foreignField: '_id',
					localField: 'userId',
					as: 'guest',
				},
			},
			{
				$unwind: '$guest',
			},
			{
				$lookup: {
					from: 'stay',
					foreignField: '_id',
					localField: 'stayId',
					as: 'stay',
				},
			},
			{
				$unwind: '$stay',
			},
			{
				$lookup: {
					from: 'user',
					foreignField: '_id',
					localField: 'hostId',
					as: 'host',
				},
			},
			{
				$unwind: '$host',
			},
			{
				$project: {
					startDate: 1,
					endDate: 1,
					status: 1,
					totalPrice: 1,
					guests: 1,
					createdAt: 1,

					guest: {
						_id: '$guest._id',
						imgUrl: '$guest.imgUrl',
						fullname: { $ifNull: ['$guest.fullname', '$guest.name'] },
						email: '$guest.email',
					},

					stay: {
						_id: '$stay._id',
						name: '$stay.name',
						imgUrls: '$stay.imgUrls',
						imgUrl: '$stay.imgUrl',
						price: '$stay.price',
					},
				},
			},
		])
		.toArray()
	return orders
}

async function getById(orderId: string): Promise<Order> {
	try {
		const _id = _asObjectId(orderId)
		if (!_id) throw new Error(`Invalid order id: ${orderId}`)

		const collection = await dbService.getCollection(COLLECTION_NAME)
		const order = await collection.findOne({ _id })
		
		if (!order) {
			throw new Error(`Order not found: ${orderId}`)
		}

		return order as Order
	} catch (err) {
		logger.error(`ERROR: cannot find order ${orderId}`)
		throw err
	}
}

async function add(order: Omit<Order, "_id" | "createdAt">): Promise<Order> {
	try {
		const collection = await dbService.getCollection(COLLECTION_NAME)

		const orderToAdd = {
			userId: ObjectId.createFromHexString(order.userId),
			stayId: ObjectId.createFromHexString(order.stayId),
			hostId: ObjectId.createFromHexString(order.hostId),
			totalPrice: order.totalPrice,
			startDate: new Date(order.startDate),
			endDate: new Date(order.endDate),
			guests: order.guests,
			status: order.status || 'pending',
			createdAt: new Date(),
			contactEmail: order.contactEmail || null,
		}

		const result = await collection.insertOne(orderToAdd)
		return { ...order, _id: result.insertedId.toString() } as Order
	} catch (err) {
		logger.error('ERROR: cannot add order')
		throw err
	}
}

async function update(order: Order): Promise<AggregateOrder> {
	try {
		// console.log('order status!!!!!!!!!!!!!!', typeof order.status)
		// console.log('order id!!!!!!!!!!!!!!', typeof order._id)
		// console.log('order id!!!!!!!!!!!!!!', order._id)

		const collection = await dbService.getCollection(COLLECTION_NAME)

		if (!order._id) {
			throw new Error('Order _id is required for update')
		}

		const _id = _asObjectId(order._id)
		if (!_id) {
			throw new Error(`Invalid order id: ${order._id}`)
		}

		await collection.updateOne(
			{ _id },
			{ $set: { status: order.status } }
		)

		const updatedOrder = await collection
			.aggregate([
				{
					$match: { _id }
				},
				{
					$lookup: {
						from: 'user',
						foreignField: '_id',
						localField: 'userId',
						as: 'guest',
					},
				},
				{
					$unwind: '$guest',
				},
				{
					$lookup: {
						from: 'stay',
						foreignField: '_id',
						localField: 'stayId',
						as: 'stay',
					},
				},
				{
					$unwind: '$stay',
				},
				{
					$lookup: {
						from: 'user',
						foreignField: '_id',
						localField: 'hostId',
						as: 'host',
					},
				},
				{
					$unwind: '$host',
				},
				{
					$project: {
						_id: 1,
						userId: 1,
						hostId: 1,
						stayId: 1,
						startDate: 1,
						endDate: 1,
						status: 1,
						totalPrice: 1,
						guests: 1,
						createdAt: 1,
						contactEmail: 1,

						guest: {
							_id: '$guest._id',
							imgUrl: '$guest.imgUrl',
							fullname: { $ifNull: ['$guest.fullname', '$guest.name'] },
							email: '$guest.email',
						},

						stay: {
							_id: '$stay._id',
							name: '$stay.name',
							imgUrls: '$stay.imgUrls',
							loc: '$stay.loc',
						},

						host: {
							_id: '$host._id',
							imgUrl: '$host.imgUrl',
							fullname: { $ifNull: ['$host.fullname', '$host.name'] },
							email: '$host.email',
						},
					},
				},
			])
			.toArray()

		if (!updatedOrder[0]) {
			throw new Error(`Order not found after update: ${order._id}`)
		}

		return updatedOrder[0] as AggregateOrder
	} catch (err) {
		logger.error(`ERROR: cannot update order ${order._id}`)
		throw err
	}
}

async function remove(orderId: string): Promise<void> {
	try {
		const _id = _asObjectId(orderId)
		if (!_id) throw new Error(`Invalid order id: ${orderId}`)

		const collection = await dbService.getCollection(COLLECTION_NAME)
		await collection.deleteOne({ _id })
	} catch (err) {
		logger.error(`ERROR: cannot remove order ${orderId}`)
		throw err
	}
}
