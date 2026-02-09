import { reviewService } from '../../services/review/index.js'

import { store } from '../store.js'
import { ADD_REVIEW, REMOVE_REVIEW, SET_REVIEWS } from '../reducers/review.reducer.js'
import { SET_SCORE } from '../reducers/user.reducer.js'
import { Review } from '../../types/review.js'
import { Dispatch } from 'redux'

export async function loadReviews(filterBy: {name: string}) {
	try {
		const reviews = await reviewService.query(filterBy)
		store.dispatch({ type: SET_REVIEWS, reviews })
	} catch (err) {
		console.log('ReviewActions: err in loadReviews', err)
		throw err
	}
}

export async function addReview(review: Partial<Review>) {
	try {
		const addedReview = await reviewService.add(review);
		(store.dispatch as Dispatch)(getActionAddReview(addedReview))
	} catch (err) {
		console.log('ReviewActions: err in addReview', err)
		throw err
	}
}

export async function removeReview(reviewId: string) {
	try {
		await reviewService.remove(reviewId);
		(store.dispatch as Dispatch)(getActionRemoveReview(reviewId))
	} catch (err) {
		console.log('ReviewActions: err in removeReview', err)
		throw err
	}
}
export function getActionRemoveReview(reviewId: string) {
	return { type: REMOVE_REVIEW, reviewId }
}
export function getActionAddReview(review: Review) {
	return { type: ADD_REVIEW, review }
}
