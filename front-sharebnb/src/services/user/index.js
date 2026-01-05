const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

// console.log('User service - VITE_LOCAL:', VITE_LOCAL, 'Type:', typeof VITE_LOCAL)

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
        email: '',   // NEW
        isAdmin: false,
        score: 100,
    }
}

// Force remote service for now to debug the issue
const service = remote // (VITE_LOCAL === 'true')? local : remote
// console.log('Using user service:', service === local ? 'LOCAL' : 'REMOTE')

export const userService = { ...service, getEmptyUser }

if (DEV) window.userService = userService
