import dataRooms from '../../apiData.json'
import { RoomInterface } from '../interfaces/roomInterface'

const rooms: RoomInterface[] = dataRooms.rooms

export class RoomService {
    getAll(): RoomInterface[] {
        return rooms
    }

    getById(id: string): RoomInterface {
        const room = rooms.find((roomData: RoomInterface) => roomData.id === id)
        if (!room) {
            throw new Error(`Room with id: ${id} not found`)
        }
        return room
    }

    create(newRoom: RoomInterface): RoomInterface {
        rooms.push(newRoom)
        return newRoom
    }

    update(id: string, updatedRoom: RoomInterface): RoomInterface | null {
        const roomIndex = rooms.findIndex((room) => room.id === id)
        if (roomIndex !== -1) {
            rooms[roomIndex] = updatedRoom
            return rooms[roomIndex]
        }
        return rooms[roomIndex]
    }

    delete(id: string): boolean {
        const roomIndex = rooms.findIndex((room) => room.id === id)
        if (roomIndex === -1) {
            return false
        }
        rooms.splice(roomIndex, 1)
        return true
    }
}