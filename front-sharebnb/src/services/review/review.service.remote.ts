import { httpService } from '../http.service.js'

//types
import { ReviewService } from '../../types/global.js'
import { Review } from '../../types/review.js'

export const reviewService: ReviewService = {
	add,
	query,
	remove,
}

function query(filterBy: { name: string }): Promise<Review[]> | Promise<[]> {
	var queryStr = !filterBy ? '' : `?name=${filterBy.name}&sort=anaAref`
	return httpService.get(`review${queryStr}`)
}

async function remove(reviewId: string): Promise<void> {
	await httpService.delete(`review/${reviewId}`)
}

async function add({ txt, aboutStayId }: { txt: string, aboutStayId: string }): Promise<Review> {
	return await httpService.post(`review`, { txt, aboutStayId })
}