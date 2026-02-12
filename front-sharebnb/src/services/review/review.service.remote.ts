import { httpService } from '../http.service.js'

//types
import { ReviewService } from '../../types/global.js'
import { Review } from '../../types/review.js'
import { AggregateReview as ReviewBackend} from '../../../../back-sharebnb/types/review.js'

export const reviewService: ReviewService = {
	add,
	query,
	remove,
}

function query(filterBy: { byUserId: string, aboutStayId: string}): Promise<ReviewBackend[]> | Promise<[]> {
	var queryStr = !filterBy ? '' : `?byUserId=${filterBy.byUserId}&aboutStayId=${filterBy.aboutStayId}`
	return httpService.get(`review${queryStr}`)
}

async function remove(reviewId: string): Promise<void> {
	await httpService.delete(`review/${reviewId}`)
}

async function add({ txt, aboutStayId }: { txt: string, aboutStayId: string }): Promise<ReviewBackend> {
	return await httpService.post(`review`, { txt, aboutStayId })
}