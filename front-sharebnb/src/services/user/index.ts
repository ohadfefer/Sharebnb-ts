const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local.js'
import { userService as remote } from './user.service.remote.js'

// console.log('User service - VITE_LOCAL:', VITE_LOCAL, 'Type:', typeof VITE_LOCAL)

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
        email: '',  
        isAdmin: false,
    }
}

// Force remote service for now to debug the issue
const service = remote // (VITE_LOCAL === 'true')? local : remote
// console.log('Using user service:', service === local ? 'LOCAL' : 'REMOTE')

export const userService = { ...service, getEmptyUser }

if (DEV) window.userService = userService
