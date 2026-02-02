import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadReviews, removeReview, getActionAddReview, getActionRemoveReview } from '../store/actions/review.actions.js'
import { loadUsers } from '../store/actions/user.actions.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { socketService, SOCKET_EVENT_REVIEW_ADDED, SOCKET_EVENT_REVIEW_REMOVED } from '../services/socket.service.js'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { ReviewEdit } from '../cmps/ReviewEdit.jsx'
import { useAppSelector } from '../store/hooks.js'

// types

import { Review } from '../types/stay.js' // Review type should taken from review.d.ts which does not exist right now 

export function ReviewIndex() {
	const loggedInUser = useAppSelector(storeState => storeState.userModule.user)
	const reviews = useAppSelector(storeState => storeState.reviewModule.reviews)

	const dispatch = useDispatch()

	useEffect(() => {
		loadReviews()
		loadUsers()

		socketService.on(SOCKET_EVENT_REVIEW_ADDED, (review: Review) => {
			console.log('GOT from socket', review)
			dispatch(getActionAddReview(review))
		})

		socketService.on(SOCKET_EVENT_REVIEW_REMOVED, (reviewId: string) => {
			console.log('GOT from socket', reviewId)
			dispatch(getActionRemoveReview(reviewId))
		})

		return () => {
            socketService.off(SOCKET_EVENT_REVIEW_ADDED)
            socketService.off(SOCKET_EVENT_REVIEW_REMOVED)
        }
	}, [])

	async function onRemoveReview(reviewId: string) {
		try {
			await removeReview(reviewId)
			showSuccessMsg('Review removed')
		} catch (err) {
			showErrorMsg('Cannot remove')
		}
	}
    console.log(reviews)
	return <div className="review-index">
        <h2>Reviews and Gossip</h2>
        {loggedInUser && <ReviewEdit/>}
        <ReviewList 
            reviews={reviews} 
            onRemoveReview={onRemoveReview}/>
    </div>
}