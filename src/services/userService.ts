import { UserDocument } from '../models/user.model'
import User from '../models/user.model'

export class UserService {
    async getAll(): Promise<UserDocument[]> {
        return User.find().exec()
    }

    async getById(id: string): Promise<UserDocument> {
        const user = await User.findById(id).exec()
        if (!user) {
            throw new Error(`User with id: ${id} not found`)
        }
        return user
    }

    async create(newUser: Omit<UserDocument, '_id'>): Promise<UserDocument> {
        const user = new User(newUser)
        return user.save()
    }

    async update(id: string, updatedUser: Partial<Omit<UserDocument, '_id'>>): Promise<UserDocument> {
        const user = await User.findByIdAndUpdate(id, updatedUser, { new: true }).exec()
        if (!user) {
            throw new Error(`User with id: ${id} not found`)
        }
        return user
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(id).exec()
        return result !== null
    }
}