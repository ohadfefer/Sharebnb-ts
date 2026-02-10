import { ADD_REVIEW, REMOVE_REVIEW, SET_REVIEWS, UPDATE_REVIEW } from "../store/reducers/review.reducer.ts";
import { AggregateReview as ReviewBackend } from "../../../back-sharebnb/types/review.js";

export interface Review {
    _id: string
    byUserId: string
    aboutStayId: string
    txt: string
    createdAt?: Date
}

export type ReviewAction =
    | { type: typeof SET_REVIEWS, reviews: ReviewBackend[] | [] }
    | { type: typeof ADD_REVIEW, review: ReviewBackend }
    | { type: typeof REMOVE_REVIEW, reviewId: string }
    | { type: typeof UPDATE_REVIEW, review: ReviewBackend }

