// services/user/user.service.remote.ts
import { httpService } from '../http.service.js'
import type { User as UserBackend } from '../../../../back-sharebnb/types/user.js'
import type { LoggedInUser, SignupCredentials } from '../../types/user.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
	getLoggedinUser,
	saveLoggedinUser,
}

function getUsers(): Promise<UserBackend[]> {
	return httpService.get(`user`)
}

async function getById(userId: string): Promise<UserBackend> {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId: string) {
	return httpService.delete(`user/${userId}`)
}

async function update({ _id }: Partial<UserBackend>): Promise<UserBackend> {
	const user = await httpService.put(`user/${_id}`, { _id })

	const loggedinUser = getLoggedinUser()
	if (loggedinUser?._id === user._id) saveLoggedinUser(user)

	return user
}

async function login(userCred: Partial<UserBackend>): Promise<LoggedInUser | undefined> {
	const user = await httpService.post<LoggedInUser>('auth/login', userCred)
	if (user) return saveLoggedinUser(user)
	return undefined
}

async function signup(userCred: SignupCredentials): Promise<LoggedInUser> {
	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

	const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser(): LoggedInUser | null {
	const storedUser = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
	if (!storedUser) return null
	const user: LoggedInUser = JSON.parse(storedUser)
	// console.log('getLoggedinUser called, result:', user)
	return user
}

function saveLoggedinUser<T>(user: T): T {
	// console.log('saveLoggedinUser called with:', user)
	// user = { 
	//     _id: user._id, 
	//     fullname: user.fullname, 
	//     imgUrl: user.imgUrl, 
	//     score: user.score, 
	//     isAdmin: user.isAdmin,
	// 	email: user.email || null,
	// }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	// console.log('User saved to sessionStorage:', user)
	return user
}
