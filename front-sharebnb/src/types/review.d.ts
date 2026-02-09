import { ADD_REVIEW, REMOVE_REVIEW, SET_REVIEWS, UPDATE_REVIEW } from "../store/reducers/review.reducer.ts";

export interface Review {
    at?: string
    by: { fullname: string; imgUrl: string; _id: string }
    txt: string
    _id: string
    aboutStayId: string
    aboutStay?: { fullname: string; imgUrl: string; _id: string } 
}

export type ReviewAction =
    | { type: typeof SET_REVIEWS, reviews: Review[] | [] }
    | { type: typeof ADD_REVIEW, review: Review }
    | { type: typeof REMOVE_REVIEW, reviewId: string }
    | { type: typeof UPDATE_REVIEW, review: Review }

