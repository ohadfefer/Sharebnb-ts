const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeLorem } from '../util.service.js'

import { stayService as remote } from './stay.service.remote.js'
import { stayService as local } from './stay.service.local.js'

// console.log('Stay service - VITE_LOCAL:', VITE_LOCAL, 'Type:', typeof VITE_LOCAL)

function getEmptyStay() {
	return {
        _id: '',
		name:  makeLorem(3),
		price: getRandomIntInclusive(80, 240),
		msgs: [],
	}
}

function getDefaultFilter() {
    return {
        address: '',
        maxPrice: '',
        checkIn: '',
        checkOut: '',
        guests: {adults: 0, children: 0, infants: 0, pets: 0,},
        labels: [],
    }
}

// Force remote service for now to debug the issue
const service = remote // (VITE_LOCAL === 'true') ? local : remote
// console.log('Using stay service:', service === local ? 'LOCAL' : 'REMOTE')

export const stayService = { getEmptyStay, getDefaultFilter, ...service }


if (DEV) window.stayService = stayService
