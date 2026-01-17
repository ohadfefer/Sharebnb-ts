import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

// types
import { FilterBy, Stay, StayMsg } from '../../types/stay.js'

const PAGE_SIZE = 3

export const stayService = {
	remove,
	query,
	getById,
	add,
	update,
	addStayMsg,
	removeStayMsg,
	addToWishlist,
	removeFromWishlist,
	getWishlistStays,
}

function _asObjectId(id: string) {                 // NEW
	if (!id) return null
	try { return new ObjectId(String(id)) } catch { return null }
}

async function query(filterBy: FilterBy): Promise<Stay[]> {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('stay')
		// console.log('criteria =>', JSON.stringify(criteria)) // EDIT (debug-friendly)

		const stayCursor = await collection.find(criteria)   // if needed: add sort later
		const stays: Stay[] = await stayCursor.toArray()
		return stays
	} catch (err) {
		logger.error('cannot find stays', err)
		throw err
	}
}

async function getById(stayId: string): Promise<Stay> {
	try {
		// const _id = _asObjectId(stayId)                     // NEW (robust)
		// if (!_id) throw new Error(`Invalid stay id: ${stayId}`) // NEW

		const collection = await dbService.getCollection('stay')
		const stay: Stay = await collection.findOne({ _id: ObjectId.createFromHexString(stayId) })

		if (!stay) throw new Error(`Stay not found: ${stayId}`) // NEW

		// stay.createdAt = stay._id?.getTimestamp()
		return stay
	} catch (err) {
		logger.error(`while finding stay ${stayId}`, err)
		throw err
	}
}

async function remove(stayId: string): Promise<string> {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: hostId, isAdmin } = loggedinUser

	try {
		const _id = _asObjectId(stayId)                     // NEW
		if (!_id) throw new Error(`Invalid stay id: ${stayId}`) // NEW

		const criteria: Record<string, any> = { _id }
		if (!isAdmin) criteria['host._id'] = hostId

		const collection = await dbService.getCollection('stay')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your stay')
		return stayId
	} catch (err) {
		logger.error(`cannot remove stay ${stayId}`, err)
		throw err
	}
}

async function add(stay: Stay): Promise<Stay> {
	try {
		if (stay.loc) {
			stay.loc.lat = Number(stay.loc.lat)
			stay.loc.lng = Number(stay.loc.lng)
		}
		logger.info('stay.service.add -> final stay.host:', stay.host)
		const collection = await dbService.getCollection('stay')
		const result = await collection.insertOne(stay)

		return { ...stay, _id: result.insertedId }
	} catch (err) {
		logger.error('cannot insert stay', err)
		throw err
	}
}

async function update(stay: Stay): Promise<Stay> {
	const stayToSave: Partial<Stay> = { 
		name: stay.name, 
		price: stay.price,
		capacity: stay.capacity,
		bedrooms: stay.bedrooms,
		bathrooms: stay.bathrooms,
		labels: stay.labels,
		amenities: stay.amenities,
		imgUrls: stay.imgUrls
	}
	if (stay.loc) {
		stayToSave.loc = {
			address: stay.loc.address,
			city: stay.loc.city,
			country: stay.loc.country,
			countryCode: stay.loc.countryCode,
			lat: Number(stay.loc.lat),
			lng: Number(stay.loc.lng),
		}
	}
	try {
		const _id = _asObjectId(stay._id || '')                   // NEW
		if (!_id) throw new Error(`Invalid stay id: ${stay?._id}`) // NEW

		const collection = await dbService.getCollection('stay')
		await collection.updateOne({ _id }, { $set: stayToSave })

		return { ...stay, _id: _id.toString() }
	} catch (err) {
		logger.error(`cannot update stay ${stay._id}`, err)
		throw err
	}
}

async function addStayMsg(stayId: string, msg: StayMsg): Promise<StayMsg> {
	try {
		const _id = _asObjectId(stayId)                     // NEW
		if (!_id) throw new Error(`Invalid stay id: ${stayId}`) // NEW

		msg.id = makeId()

		const collection = await dbService.getCollection('stay')
		await collection.updateOne({ _id }, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add stay msg ${stayId}`, err)
		throw err
	}
}

async function removeStayMsg(stayId: string, msgId: string): Promise<string> {
	try {
		const _id = _asObjectId(stayId)                     // NEW
		if (!_id) throw new Error(`Invalid stay id: ${stayId}`) // NEW

		const collection = await dbService.getCollection('stay')
		await collection.updateOne({ _id }, { $pull: { msgs: { id: msgId } } })

		return msgId
	} catch (err) {
		logger.error(`cannot remove stay msg ${stayId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy: FilterBy): Record<string, any> {
	console.log('_buildCriteria -> filterBy:', filterBy)
	
	const criteria = {}
	const andConditions = []

	// Host ID filter
	if (filterBy.hostId) {
		const hostIdOr = [{ 'host._id': filterBy.hostId }]
		try {
			hostIdOr.push({ 'host._id': ObjectId.createFromHexString(filterBy.hostId).toString() })
		} catch (e) { }
		andConditions.push({ $or: hostIdOr })
	}

	// Address filter - search in city, country, and address fields with flexible matching
	if (filterBy.address && filterBy.address.trim()) {
		const searchTerm = filterBy.address.trim().toLowerCase()
		console.log('Searching for address term:', searchTerm)
		
		// Create flexible search patterns
		const addressOr = []
		
		// Direct matches in location fields
		addressOr.push(
			{ 'loc.city': { $regex: searchTerm, $options: 'i' } },
			{ 'loc.country': { $regex: searchTerm, $options: 'i' } },
			{ 'loc.address': { $regex: searchTerm, $options: 'i' } },
			{ 'name': { $regex: searchTerm, $options: 'i' } }
		)
		
		// Handle specific location mappings for common search terms
		if (searchTerm.includes('santorini') || searchTerm.includes('fira') || searchTerm.includes('greece')) {
			// If searching for Santorini-related terms, also match stays with Santorini coordinates
			// Santorini coordinates: lat: 36.4123, lng: 25.4321 (approximately)
			addressOr.push({
				$and: [
					{ 'loc.lat': { $gte: 36.0, $lte: 37.0 } },
					{ 'loc.lng': { $gte: 25.0, $lte: 26.0 } }
				]
			})
		}
		
		// Handle partial matches for common location terms
		if (searchTerm.includes('fira')) {
			addressOr.push(
				{ 'loc.city': { $regex: 'santorini', $options: 'i' } },
				{ 'loc.address': { $regex: 'greece', $options: 'i' } }
			)
		}
		
		if (searchTerm.includes('greece')) {
			addressOr.push(
				{ 'loc.city': { $regex: 'santorini|athens|mykonos|crete', $options: 'i' } },
				{ 'loc.address': { $regex: 'greece', $options: 'i' } }
			)
		}
		
		andConditions.push({ $or: addressOr })
		console.log('Adding address filter with', addressOr.length, 'conditions')
	}

	// Date filters
	const { checkIn, checkOut } = filterBy
	if (checkIn && checkOut) {
		const reqStart = new Date(checkIn)
		const reqEnd = new Date(checkOut)
		if (!isNaN(+reqStart) && !isNaN(+reqEnd)) {
			andConditions.push({ availableFrom: { $lte: reqStart } })
			andConditions.push({ availableTo: { $gte: reqEnd } })
		}
	}

	// Price filter
	if (filterBy.maxPrice && filterBy.maxPrice > 0) {
		andConditions.push({ price: { $lte: filterBy.maxPrice } })
	}

	// Guests filter
	if (filterBy.guests && filterBy.guests > 0) {
		andConditions.push({ capacity: { $gte: filterBy.guests } })
	}

	// Combine all conditions
	if (andConditions.length === 0) {
		console.log('No filters applied, returning all stays')
		return {}
	} else if (andConditions.length === 1) {
		console.log('Single filter applied:', andConditions[0])
		return andConditions[0]
	} else {
		const finalCriteria = { $and: andConditions }
		console.log('Multiple filters applied:', finalCriteria)
		return finalCriteria
	}
}

async function addToWishlist(stayId: string, userId: string): Promise<Stay> {
	try {
		const _id = _asObjectId(stayId)
		if (!_id) throw new Error(`Invalid stay id: ${stayId}`)

		const collection = await dbService.getCollection('stay')
		
		// Check if user is already in wishlist
		const stay = await collection.findOne({ _id })
		if (!stay) throw new Error(`Stay not found: ${stayId}`)
		
		const wishlistEntry = { userId, addedAt: new Date() }
		
		// Check if user is already in wishlist
		const existingEntry = stay.wishlist?.find((entry: { userId: string }) => entry.userId === userId)
		if (existingEntry) {
			return stay // Already in wishlist
		}
		
		await collection.updateOne(
			{ _id }, 
			{ $push: { wishlist: wishlistEntry } }
		)
		
		// Return updated stay
		const updatedStay: Stay = await collection.findOne({ _id })
		return updatedStay
	} catch (err) {
		logger.error(`cannot add to wishlist ${stayId}`, err)
		throw err
	}
}

async function removeFromWishlist(stayId: string, userId: string): Promise<Stay> {
	try {
		const _id = _asObjectId(stayId)
		if (!_id) throw new Error(`Invalid stay id: ${stayId}`)

		const collection = await dbService.getCollection('stay')
		
		await collection.updateOne(
			{ _id }, 
			{ $pull: { wishlist: { userId } } }
		)
		
		// Return updated stay
		const updatedStay: Stay = await collection.findOne({ _id })
		return updatedStay
	} catch (err) {
		logger.error(`cannot remove from wishlist ${stayId}`, err)
		throw err
	}
}

async function getWishlistStays(userId: string): Promise<Stay[]> {
	try {
		const collection = await dbService.getCollection('stay')
		
		// Find all stays where the user is in the wishlist
		const stays: Stay[] = await collection.find({
			'wishlist.userId': userId
		}).toArray()
		
		return stays
	} catch (err) {
		logger.error(`cannot get wishlist stays for user ${userId}`, err)
		throw err
	}
}
