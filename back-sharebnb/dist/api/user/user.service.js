import { ObjectId } from 'mongodb';
import { dbService } from '../../services/db.service.js';
import { logger } from '../../services/logger.service.js';
import { reviewService } from '../review/review.service.js';
export const userService = {
    add,
    getById,
    update,
    remove,
    query,
    getByUsername,
};
function _asObjectId(id) {
    if (!id)
        return null;
    if (id instanceof ObjectId)
        return id;
    try {
        return ObjectId.isValid(String(id)) ? new ObjectId(String(id)) : null;
    }
    catch {
        return null;
    }
}
async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy);
    try {
        const collection = await dbService.getCollection('user');
        let users = await collection.find(criteria).toArray();
        users = users.map((user) => {
            delete user.password;
            return user;
        });
        return users;
    }
    catch (err) {
        logger.error('cannot find users', err);
        throw err;
    }
}
async function getById(userId) {
    try {
        const _id = _asObjectId(userId);
        if (!_id) {
            throw new Error(`Invalid user id: ${userId}`);
        }
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ _id }, { projection: { password: 0 } });
        if (!user) {
            throw new Error(`User not found: ${userId}`);
        }
        const criteria = { byUserId: userId };
        try {
            const givenReviews = await reviewService.query(criteria);
            user.givenReviews = (givenReviews || []).map((review) => {
                const { byUser, ...rest } = review;
                return rest;
            });
        }
        catch (e) {
            logger.warn('getById: failed loading givenReviews', e);
            user.givenReviews = [];
        }
        return user;
    }
    catch (err) {
        logger.error(`while finding user by id: ${userId}`, err);
        throw err;
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user');
        const user = await collection.findOne({ username }, { projection: { username: 1, fullname: 1, imgUrl: 1, isAdmin: 1, email: 1, password: 1 } });
        return user;
    }
    catch (err) {
        logger.error(`while finding user by username: ${username}`, err);
        throw err;
    }
}
async function remove(userId) {
    try {
        const _id = _asObjectId(userId);
        if (!_id)
            throw new Error(`Invalid user id: ${userId}`);
        const collection = await dbService.getCollection('user');
        await collection.deleteOne({ _id });
    }
    catch (err) {
        logger.error(`cannot remove user ${userId}`, err);
        throw err;
    }
}
async function update(user) {
    try {
        const _id = _asObjectId(user._id);
        if (!_id)
            throw new Error(`Invalid user id: ${user?._id}`);
        const userToSave = {
            fullname: user.fullname,
            username: user.username,
            imgUrl: user.imgUrl ?? null,
            email: user.email ?? null,
        };
        const collection = await dbService.getCollection('user');
        await collection.updateOne({ _id }, { $set: userToSave });
        return { _id: _id.toString(), ...userToSave };
    }
    catch (err) {
        logger.error(`cannot update user ${user._id}`, err);
        throw err;
    }
}
async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin,
            email: user.email
        };
        const collection = await dbService.getCollection('user');
        await collection.insertOne(userToAdd);
        const { password, ...userWithoutPassword } = userToAdd;
        return userWithoutPassword;
    }
    catch (err) {
        logger.error('cannot add user', err);
        throw err;
    }
}
function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' };
        criteria.$or = [
            { username: txtCriteria },
            { fullname: txtCriteria },
        ];
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance };
    }
    return criteria;
}
