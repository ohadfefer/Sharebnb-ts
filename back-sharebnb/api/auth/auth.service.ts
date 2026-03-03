import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'
import { User, SignupCredentials, LoggedInUser } from '../../types/user.js'

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

export const authService = {
	signup,
	login,
	getLoginToken,
	validateToken,
	getById,
}

async function login(username: string, password: string): Promise<User> {
	logger.debug(`auth.service - login with username: ${username}`)

	const user = await userService.getByUsername(username)
	if (!user || !user.password) {
		return Promise.reject('Invalid username or password')
	}

	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		return Promise.reject('Invalid username or password')
	}

	const { password: _, ...userWithoutPassword } = user
	return userWithoutPassword as User
}

async function signup(credentials: SignupCredentials): Promise<User> {
	const saltRounds = 10

	logger.debug(`auth.service - signup with username: ${credentials.username}, fullname: ${credentials.fullname}`)
	if (!credentials.username || !credentials.password || !credentials.fullname || !credentials.email) {
		return Promise.reject('Missing required signup information')
	}

	const userExist = await userService.getByUsername(credentials.username)
	if (userExist) {
		return Promise.reject('Username already taken')
	}

	const hash = await bcrypt.hash(credentials.password, saltRounds)
	return userService.add({
		username: credentials.username,
		password: hash,
		fullname: credentials.fullname,
		imgUrl: credentials.imgUrl,
		isAdmin: credentials.isAdmin || false,
		email: credentials.email
	})
}

function getLoginToken(user: User): string {
	const userInfo: LoggedInUser = {
		_id: user._id,
		fullname: user.fullname,
		isAdmin: user.isAdmin,
		email: user.email || null,
		imgUrl: user.imgUrl || null,
	}
	return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken: string): LoggedInUser | null {
	try {
		const json = cryptr.decrypt(loginToken)
		const loggedinUser = JSON.parse(json) as LoggedInUser
		return loggedinUser
	} catch (err) {
		// console.log('Invalid login token')
		return null
	}
}

async function getById(userId: string): Promise<User> {
	return userService.getById(userId)
}
