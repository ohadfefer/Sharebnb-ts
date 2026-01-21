import { userService } from '../../services/user/index.js'
import { socketService } from '../../services/socket.service.js'
import { store } from '../store.js'

import { showErrorMsg } from '../../services/event-bus.service.js'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer.js'
import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER, INIT_USER } from '../reducers/user.reducer.js'
import type { LoggedInUser, LoginCredentials, SignupCredentials, WatchedUser } from '../../types/user.js'

export function initUser(): void {
    // console.log('initUser called')
    const user = userService.getLoggedinUser() as LoggedInUser | null
    // console.log('initUser - user from service:', user)
    if (user) {
        // console.log('initUser - dispatching INIT_USER action')
        store.dispatch({
            type: INIT_USER,
            user
        })
        if (user._id) socketService.login(user._id)
    } else {
        console.log('initUser - no user found in sessionStorage')
    }
}

export async function loadUsers(): Promise<void> {
    try {
        store.dispatch({ type: LOADING_START })
        const users = (await userService.getUsers()) as WatchedUser[]
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function removeUser(userId: string): Promise<void> {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
}

export async function login(credentials: LoginCredentials): Promise<LoggedInUser> {
    try {
        const user = (await userService.login(credentials)) as LoggedInUser | undefined
        if (!user) throw new Error('Login failed')
        store.dispatch({
            type: SET_USER,
            user
        })
        if (user._id) socketService.login(user._id)
        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

export async function signup(credentials: SignupCredentials): Promise<LoggedInUser> {
    try {
        const user = (await userService.signup(credentials)) as LoggedInUser
        store.dispatch({
            type: SET_USER,
            user
        })
        if (user._id) socketService.login(user._id)
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

export async function logout(): Promise<void> {
    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
        socketService.logout()
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

export async function loadUser(userId: string): Promise<void> {
    try {
        const user = (await userService.getById(userId)) as WatchedUser
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}