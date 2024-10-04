import mysql, { RowDataPacket } from 'mysql2/promise'
import { BookingInterface } from '../interfaces/bookingInterface'

export class BookingServices {
    private connection: mysql.Connection

    constructor(connection: mysql.Connection) {
        this.connection = connection
    }

    async getAll(): Promise<BookingInterface[]> {
        const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM bookings')
        return rows as BookingInterface[]
    }

    async getById(id: number): Promise<BookingInterface> {
        const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM bookings WHERE id = ?', [id])
        const booking = rows[0]
        if (!booking) {
            throw new Error(`Booking with id: ${id} not found`)
        }
        return booking as BookingInterface
    }

    async create(newBooking: BookingInterface): Promise<BookingInterface> {
        if (Object.keys(newBooking).length === 0) {
            throw new Error("No fields to update.")
        }
        const columns = Object.keys(newBooking).join(', ')
        const placeholders = Object.keys(newBooking).map(() => '?').join(', ')

        const values = Object.values(newBooking)

        const query = `INSERT INTO bookings (${columns}) VALUES (${placeholders})`

        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values)

            const createdUser = { ...newBooking, id: result.insertId }
            return createdUser
        } catch (error) {
            console.error('Error creating booking:', error)
            throw new Error('Failed to create booking')
        }
    }

    async update(id: number, updatedBooking: Partial<BookingInterface>): Promise<BookingInterface> {
        if (Object.keys(updatedBooking).length === 0) {
            throw new Error("No fields to update.")
        }


        const columns = Object.keys(updatedBooking)
            .map(key => `${key} = ?`)
            .join(', ')


        const values = Object.values(updatedBooking)

        values.push(id)

        const query = `UPDATE bookings SET ${columns} WHERE id = ?`
        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values)
            if (result.affectedRows === 0) {
                throw new Error(`Booking with id: ${id} not found`)
            }
            return this.getById(id)
        } catch (error) {
            console.error('Error updating booking:', error)
            throw new Error('Failed to update booking')
        }
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await this.connection.execute<mysql.ResultSetHeader>('DELETE FROM bookings WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}