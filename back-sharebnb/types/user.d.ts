export interface User {
    _id: string
    username: string
    fullname: string
    isAdmin: boolean
    email?: string | null
    imgUrl?: string | null
}

// based on what's stored in the token (from auth.service.js getLoginToken)
export type LoggedInUser = Omit<User, 'username'>