import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { userService } from '../user/user.service.js'
import { authService } from '../auth/auth.service.js'
import { reviewService } from './review.service.js'
import { stayService } from '../stay/stay.service.js'

export async function getReviews(req, res) {
	try {
		// logger.info('req.query ----------->', req.query)
		const reviews = await reviewService.query(req.query)
		res.send(reviews)
	} catch (err) {
		logger.error('Cannot get reviews', err)
		res.status(400).send({ err: 'Failed to get reviews' })
	}
}

export async function removeReview(req, res) {
	var { loggedinUser } = req
	const { id: reviewId } = req.params

	try {
		const deletedCount = await reviewService.remove(reviewId)
		if (deletedCount === 1) {
			socketService.broadcast({ type: 'review-removed', data: reviewId, userId: loggedinUser._id })
			res.send({ msg: 'Deleted successfully' })
		} else {
			res.status(400).send({ err: 'Cannot remove review' })
		}
	} catch (err) {
		logger.error('Failed to delete review', err)
		res.status(400).send({ err: 'Failed to delete review' })
	}
}

export async function addReview(req, res) {			/// this is the review that sent back to the client	-> add proper type for review ///
	var { loggedinUser } = req

	try {
		var review = req.body
		const { aboutStayId } = review
		review.byUserId = loggedinUser._id
		review = await reviewService.add(review)

		// Give the user credit for adding a review
		// var user = await userService.getById(review.byUserId)

		// await userService.update(loggedinUser)


		// const loginToken = authService.getLoginToken(loggedinUser)
		// res.cookie('loginToken', loginToken)

		// prepare the updated review for sending out
		const stay = await stayService.getById(aboutStayId)
		
		review.byUser = { fullname: loggedinUser.fullname, imgUrl: loggedinUser.imgUrl }
		review.aboutStay = { fullname: stay.name }

		// delete unnecessary fields from the client-side review object 
		delete review.aboutStayId
		delete review.byUserId

		// socketService.broadcast({ type: 'review-added', data: review, userId: loggedinUser._id })
		// socketService.emitToUser({ type: 'review-about-stay', data: review, userId: review.aboutStay._id })

		// const fullUser = await userService.getById(loggedinUser._id)
		// socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

		res.send(review)
	} catch (err) {
		logger.error('Failed to add review', err)
		res.status(400).send({ err: 'Failed to add review' })
	}
}
