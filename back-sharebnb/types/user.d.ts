export type User = Omit<UserWithPassword, 'password'>
    

export interface UserFilterBy {
	txt?: string
	minBalance?: number
}

export interface UserWithPassword {
	_id?: string
	username: string
	fullname: string
	isAdmin: boolean
	email?: string | null
	imgUrl?: string | null
	password?: string
}

export interface SignupCredentials {
	username: string
	password: string
	fullname: string
	email?: string
	imgUrl?: string | null
	isAdmin?: boolean
}

// based on what's stored in the token (from auth.service.js getLoginToken)
export type LoggedInUser = Omit<User, 'username'>