import { RoomDocument } from '../models/room.model'
import Room from '../models/room.model'

export class RoomService {
    async getAll(): Promise<RoomDocument[]> {
        return Room.find().exec()
    }

    async getById(id: string): Promise<RoomDocument> {
        const room = await Room.findById(id).exec()
        if (!room) {
            throw new Error(`User with id: ${id} not found`)
        }
        return room
    }

    async create(newUser: Omit<RoomDocument, '_id'>): Promise<RoomDocument> {
        const room = new Room(newUser)
        return room.save()
    }

    async update(id: string, updatedRoom: Partial<Omit<RoomDocument, '_id'>>): Promise<RoomDocument> {
        const room = await Room.findByIdAndUpdate(id, updatedRoom, { new: true }).exec()
        if (!room) {
            throw new Error(`Room with id: ${id} not found`)
        }
        return room
    }

    async delete(id: string): Promise<boolean> {
        const result = await Room.findByIdAndDelete(id).exec()
        return result !== null
    }
}