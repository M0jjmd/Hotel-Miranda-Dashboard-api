import data from '../../rooms.json'
import { RoomInterface } from '../interfaces/roomInterface'

const rooms: RoomInterface[] = data.rooms
export class RoomService {
    getAll(): RoomInterface[] {
        return rooms
    }

}