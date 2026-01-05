// services/user/user.service.remote.js
import { httpService } from '../http.service'

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

function getUsers() {
	return httpService.get(`user`)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
	const user = await httpService.put(`user/${_id}`, { _id, score })

	const loggedinUser = getLoggedinUser()
	if (loggedinUser?._id === user._id) saveLoggedinUser(user)

	return user
}

async function login(userCred) {
	const user = await httpService.post('auth/login', userCred)
	if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
	userCred.score = 10000

	const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
	const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
	console.log('getLoggedinUser called, result:', user)
	return user
}

function saveLoggedinUser(user) {
    console.log('saveLoggedinUser called with:', user)
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
