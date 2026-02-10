export const SET_REVIEWS = 'SET_REVIEWS'
export const ADD_REVIEW = 'ADD_REVIEW'
export const REMOVE_REVIEW = 'REMOVE_REVIEW'
export const UPDATE_REVIEW = 'UPDATE_REVIEW'

//types
import { Review, ReviewAction } from '../../types/review.js'
import { AggregateReview as ReviewBackend } from '../../../../back-sharebnb/types/review.js'

interface ReviewState {
  reviews: ReviewBackend[] | []
  filterBy: { name: string }
}

const reviewState: ReviewState = {
  reviews: [],
  filterBy: { name: '' } // no SET_FILTER_BY in reducer (no filter for now)
}

export function reviewReducer(state: ReviewState = reviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, reviews: action.reviews }
    case ADD_REVIEW:
      return { ...state, reviews: [...state.reviews, action.review] }
    case REMOVE_REVIEW:
      return { ...state, reviews: state.reviews.filter(review => review._id !== action.reviewId) }
    case UPDATE_REVIEW:
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review._id === action.review._id ? action.review : review
        )
      }
    default:
      return state
  }
}
