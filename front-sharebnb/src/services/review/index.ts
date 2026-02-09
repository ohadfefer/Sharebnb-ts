const { DEV, VITE_LOCAL } = import.meta.env

import { reviewService as local } from './review.service.local.js'
import { reviewService as remote } from './review.service.remote.js'

export const reviewService = remote // (VITE_LOCAL === 'true')? local : remote


if (DEV) window.reviewService = reviewService
