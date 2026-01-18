import { Request, Response } from 'express'
import { userService } from './user.service.js'
import { logger } from '../../services/logger.service.js'
import { User, UserFilterBy } from '../../types/user.js'



export async function getUser(req: Request, res: Response) {
	try {
		const user: User = await userService.getById(req.params.id as string)
		res.send(user)
	} catch (err) {
		logger.error('Failed to get user', err)
		res.status(400).send({ err: 'Failed to get user' })
	}
}

export async function getUsers(req: Request, res: Response) {
	try {
		const filterBy: UserFilterBy = {
			txt: (req.query?.txt as string) || '',
			minBalance: +(req.query?.minBalance as string) || 0
		}
		const users: User[] = await userService.query(filterBy)
		res.send(users)
	} catch (err) {
		logger.error('Failed to get users', err)
		res.status(400).send({ err: 'Failed to get users' })
	}
}

export async function deleteUser(req: Request, res: Response) {
	try {
		await userService.remove(req.params.id as string)
		res.send({ msg: 'Deleted successfully' })
	} catch (err) {
		logger.error('Failed to delete user', err)
		res.status(400).send({ err: 'Failed to delete user' })
	}
}

export async function updateUser(req: Request, res: Response) {
	try {
		const user = req.body as User
		const savedUser: User = await userService.update(user)
		res.send(savedUser)
	} catch (err) {
		logger.error('Failed to update user', err)
		res.status(400).send({ err: 'Failed to update user' })
	}
}
