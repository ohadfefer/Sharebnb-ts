import { INIT_USER, SET_USER, SET_WATCHED_USER, REMOVE_USER, SET_USERS, SET_SCORE } from '../store/reducers/user.reducer.ts'

export interface WatchedUser {
    _id?: string
    username: string
    fullname: string
    isAdmin: boolean
    email?: string | null | undefined
    imgUrl?: string | null | undefined
    score?: number
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface SignupCredentials {
    username: string
    password: string
    fullname: string
    email?: string
    imgUrl?: string | null
    isAdmin?: boolean
}

export interface LoggedInUser {
    _id: string | undefined
    fullname: string
    isAdmin: boolean
    email?: string | null | undefined
    imgUrl?: string | null | undefined
    score?: number
}



export interface UserState {
    user: LoggedInUser | null
    users: WatchedUser[]
    watchedUser: WatchedUser | null
}

export type UserAction =
    | { type: typeof INIT_USER; user: LoggedInUser }
    | { type: typeof SET_USER; user: LoggedInUser | null }
    | { type: typeof SET_WATCHED_USER; user: WatchedUser }
    | { type: typeof REMOVE_USER; userId: string }
    | { type: typeof SET_USERS; users: WatchedUser[] }
    | { type: typeof SET_SCORE; score: number }