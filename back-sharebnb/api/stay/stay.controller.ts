// import { log } from '../../middlewares/logger.middleware.js'
import { Request, Response } from 'express'
import { logger } from '../../services/logger.service.js'
import { stayService } from './stay.service.js'
import { userService } from '../user/user.service.js'
import { makeId } from '../../services/util.service.js'

// types

import { AuthenticatedRequest } from '../../types/express.js'
import { Stay, StayMsg } from '../../types/stay.js'
import { User, LoggedInUser } from '../../types/user.js'

export async function getStays(req: Request, res: Response) {
	try {
		// Pass through filters explicitly and KEEP types as strings.        // EDIT
		const filterBy = {
			address: (req.query.address as string) || '',
			guests: +(req.query.guests as string) || 0,
			maxPrice: +(req.query.maxPrice as string) || 0,
			checkIn: (req.query.checkIn as string) || '',
			checkOut: (req.query.checkOut as string) || '',
			sortField: (req.query.sortField as string) || '',
			sortDir: +(req.query.sortDir as string) || 1,
			hostId: (req.query.hostId as string) || '',
		}

		const stays: Stay[] = await stayService.query(filterBy)
		res.json(stays)
	} catch (err) {
		logger.error('Failed to get stays', err)
		res.status(400).send({ err: 'Failed to get stays' })
	}
}

export async function getStayById(req: Request, res: Response) {
	try {
		const stayId = req.params.id as string
		const stay: Stay = await stayService.getById(stayId)
		res.json(stay)
	} catch (err) {
		logger.error('Failed to get stay', err)
		res.status(400).send({ err: 'Failed to get stay' })
	}
}

export async function addStay(req: AuthenticatedRequest, res: Response) {
	const { loggedinUser, body } = req
	const stay = body
	try {
		// Ensure host is always the logged-in user (subset of fields)
		let hostImgUrl = loggedinUser?.imgUrl

		// If imgUrl is missing from token, fetch fresh user data
		if (loggedinUser && !hostImgUrl) {
			try {
				const freshUser: User = await userService.getById(loggedinUser._id!)
				hostImgUrl = freshUser?.imgUrl
				logger.info('addStay -> fetched fresh user imgUrl:', hostImgUrl)
			} catch (err) {
				logger.warn('addStay -> failed to fetch fresh user data:', err)
			}
		}

		stay.host = loggedinUser ? {
			_id: loggedinUser._id,
			fullname: loggedinUser.fullname,
			pictureUrl: hostImgUrl,
		} : undefined

		// Debug logs to verify host assignment
		logger.info('addStay -> loggedinUser:', loggedinUser)
		logger.info('addStay -> loggedinUser.imgUrl:', loggedinUser?.imgUrl)
		logger.info('addStay -> final hostImgUrl:', hostImgUrl)
		logger.info('addStay -> final stay payload host:', stay.host)
		const addedStay: Stay = await stayService.add(stay)
		res.json(addedStay)
	} catch (err) {
		logger.error('Failed to add stay', err)
		res.status(400).send({ err: 'Failed to add stay' })
	}
}

export async function updateStay(req: AuthenticatedRequest, res: Response) {
	const { loggedinUser, body: stay } = req

	if (!loggedinUser) {
		res.status(401).send('Not Authenticated')
		return
	}

	const { _id: userId, isAdmin } = loggedinUser

	if (!isAdmin && stay.host._id !== userId) {
		res.status(403).send('Not your stay...')
		return
	}

	try {
		const updatedStay: Stay = await stayService.update(stay)
		res.json(updatedStay)
	} catch (err) {
		logger.error('Failed to update stay', err)
		res.status(400).send({ err: 'Failed to update stay' })
	}
}

export async function removeStay(req: Request, res: Response) {
	try {
		const stayId = req.params.id as string
		const removedId: string = await stayService.remove(stayId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove stay', err)
		res.status(400).send({ err: 'Failed to remove stay' })
	}
}

export async function addStayMsg(req: AuthenticatedRequest, res: Response) {
	const { loggedinUser } = req

	if (!loggedinUser) {
		res.status(401).send('Not Authenticated')
		return
	}

	try {
		const stayId = req.params.id as string
		const msg: StayMsg = {
			id: makeId(),
			txt: req.body.txt,
			by: {
				_id: loggedinUser._id as string,
				fullname: loggedinUser.fullname,
				imgUrl: loggedinUser.imgUrl || undefined,
			},
		}
		const savedMsg = await stayService.addStayMsg(stayId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to add stay msg', err)
		res.status(400).send({ err: 'Failed to add stay msg' })
	}
}

export async function removeStayMsg(req: Request, res: Response) {
	try {
		const { id: stayId, msgId } = req.params as { id: string; msgId: string }
		const removedId = await stayService.removeStayMsg(stayId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove stay msg', err)
		res.status(400).send({ err: 'Failed to remove stay msg' })
	}
}

export async function addToWishlist(req: AuthenticatedRequest, res: Response) {
	try {
		const { loggedinUser } = req
		if (!loggedinUser) {
			res.status(401).send('Not Authenticated')
			return
		}
		const stayId = req.params.id as string
		const userId = loggedinUser._id

		const updatedStay: Stay = await stayService.addToWishlist(stayId, userId as string)
		res.json(updatedStay)
	} catch (err) {
		logger.error('Failed to add to wishlist', err)
		res.status(400).send({ err: 'Failed to add to wishlist' })
	}
}

export async function removeFromWishlist(req: AuthenticatedRequest, res: Response) {
	try {
		const { loggedinUser } = req
		const stayId = req.params.id as string
		if (!loggedinUser && !req.params.userId) {
			res.status(401).send('Not Authenticated')
			return
		}
		const userId = req.params.userId as string || loggedinUser!._id

		const updatedStay: Stay = await stayService.removeFromWishlist(stayId, userId as string)
		res.json(updatedStay)
	} catch (err) {
		logger.error('Failed to remove from wishlist', err)
		res.status(400).send({ err: 'Failed to remove from wishlist' })
	}
}

export async function getWishlistStays(req: Request, res: Response) {
	try {
		const userId = req.params.userId as string
		const stays: Stay[] = await stayService.getWishlistStays(userId)
		res.json(stays)
	} catch (err) {
		logger.error('Failed to get wishlist stays', err)
		res.status(400).send({ err: 'Failed to get wishlist stays' })
	}
}