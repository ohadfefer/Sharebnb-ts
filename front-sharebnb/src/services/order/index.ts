const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeLorem } from '../util.service.js'

import { orderService as local } from './order.service.local.js'
import { orderService as remote } from './order.service.remote.js'
import type { Order, OrderFilterBy } from '../../types/order.js'

// console.log('Order service - VITE_LOCAL:', VITE_LOCAL, 'Type:', typeof VITE_LOCAL)

function getEmptyOrder(): Partial<Order> {
	return {
        _id: '',
		// name:  makeLorem(3),
		totalPrice: getRandomIntInclusive(80, 240),
	}
}

function getDefaultFilter(): OrderFilterBy {
    return {
        // address: '',
        // maxPrice: '',
        // checkIn: '',
        // checkOut: '',
        // guests: {adults: 0, children: 0, infants: 0, pets: 0,},
        // labels: [],
        hostId: undefined,
        userId: undefined
    }
}

// Force remote service for now to debug the issue
const service = remote // (VITE_LOCAL === 'true') ? local : remote
// console.log('Using order service:', service === local ? 'LOCAL' : 'REMOTE')

export const orderService = { getEmptyOrder, getDefaultFilter, ...service }


if (DEV) window.orderService = orderService
