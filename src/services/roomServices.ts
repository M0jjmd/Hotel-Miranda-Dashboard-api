import mysql, { RowDataPacket } from 'mysql2/promise'
import { RoomInterface, Facility } from '../interfaces/roomInterface'

export class RoomServices {
    private connection: mysql.Connection

    constructor(connection: mysql.Connection) {
        this.connection = connection
    }

    async getAll(): Promise<RoomInterface[]> {
        const [rows] = await this.connection.query<RowDataPacket[]>(`
            SELECT 
                r.*, 
                GROUP_CONCAT(f.id, ':', f.facility_name) AS amenities
            FROM rooms r
            LEFT JOIN room_facilities rf ON r.id = rf.room_id
            LEFT JOIN facilities f ON rf.facility_id = f.id
            GROUP BY r.id
        `)

        return rows.map(row => {
            const facilities: Facility[] = row.amenities
                ? row.amenities.split(',').map((amenity: string) => {
                    const [id, facility_name] = amenity.split(':')
                    return { id: Number(id), facility_name }
                })
                : []

            const room: RoomInterface = {
                id: row.id,
                photo: row.photo,
                room_number: row.room_number,
                bed_type: row.bed_type,
                rate: row.rate,
                offer_price: row.offer_price,
                status: row.status,
                facilities
            }

            return room
        })
    }

    async getById(id: number): Promise<RoomInterface> {
        const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM rooms WHERE id = ?', [id])
        const room = rows[0]
        if (!room) {
            throw new Error(`Room with id: ${id} not found`)
        }
        return room as RoomInterface
    }

    async create(newRoom: RoomInterface, facilityIds: number[]): Promise<RoomInterface> {
        if (Object.keys(newRoom).length === 0) {
            throw new Error("No fields to create a room.")
        }

        await this.connection.beginTransaction()

        try {
            const columns = ['photo', 'room_number', 'bed_type', 'rate', 'offer_price', 'status'].join(', ')
            const placeholders = new Array(6).fill('?').join(', ')

            const values = [newRoom.photo, newRoom.room_number, newRoom.bed_type, newRoom.rate, newRoom.offer_price, newRoom.status]
            const query = `INSERT INTO rooms (${columns}) VALUES (${placeholders})`

            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values)
            const createdRoomId = result.insertId

            if (facilityIds.length > 0) {
                const facilityInsertPromises = facilityIds.map(facilityId => {
                    return this.connection.execute(
                        'INSERT INTO room_facilities (room_id, facility_id) VALUES (?, ?)',
                        [createdRoomId, facilityId]
                    )
                })

                await Promise.all(facilityInsertPromises)
            }

            await this.connection.commit()

            return { ...newRoom, id: createdRoomId }
        } catch (error) {
            await this.connection.rollback()
            console.error('Error creating room:', error)
            throw new Error('Failed to create room')
        }
    }

    async update(id: number, updatedUser: Partial<RoomInterface>): Promise<RoomInterface> {
        if (Object.keys(updatedUser).length === 0) {
            throw new Error("No fields to update.")
        }


        const columns = Object.keys(updatedUser)
            .map(key => `${key} = ?`)
            .join(', ')


        const values = Object.values(updatedUser)

        values.push(id)

        const query = `UPDATE rooms SET ${columns} WHERE id = ?`

        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values)
            if (result.affectedRows === 0) {
                throw new Error(`Room with id: ${id} not found`)
            }
            return this.getById(id)
        } catch (error) {
            console.error('Error updating room:', error)
            throw new Error('Failed to update room')
        }
    }

    async delete(id: number): Promise<boolean> {
        await this.connection.beginTransaction()

        try {
            await this.connection.execute('DELETE FROM bookings WHERE room_id = ?', [id])

            await this.connection.execute('DELETE FROM room_facilities WHERE room_id = ?', [id])

            const [result] = await this.connection.execute<mysql.ResultSetHeader>('DELETE FROM rooms WHERE id = ?', [id])

            await this.connection.commit()

            return result.affectedRows > 0
        } catch (error) {
            console.log(error)
            await this.connection.rollback()
            console.error('Error deleting room:', error)
            throw new Error('Failed to delete room')
        }
    }
}