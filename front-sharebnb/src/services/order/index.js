const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeLorem } from '../util.service'

import { orderService as local } from './order.service.local'
import { orderService as remote } from './order.service.remote'

console.log('Order service - VITE_LOCAL:', VITE_LOCAL, 'Type:', typeof VITE_LOCAL)

function getEmptyOrder() {
	return {
        _id: '',
		name:  makeLorem(3),
		price: getRandomIntInclusive(80, 240),
	}
}

function getDefaultFilter() {
    return {
        // address: '',
        // maxPrice: '',
        // checkIn: '',
        // checkOut: '',
        // guests: {adults: 0, children: 0, infants: 0, pets: 0,},
        // labels: [],
        hostId: null,
        userId: null
    }
}

// Force remote service for now to debug the issue
const service = remote // (VITE_LOCAL === 'true') ? local : remote
console.log('Using order service:', service === local ? 'LOCAL' : 'REMOTE')

export const orderService = { getEmptyOrder, getDefaultFilter, ...service }


if (DEV) window.orderService = orderService
