import mysql, { RowDataPacket } from 'mysql2/promise'
import { UserInterface } from '../interfaces/userInterface'

export class UserServices {
    private connection: mysql.Connection

    constructor(connection: mysql.Connection) {
        this.connection = connection
    }

    async getAll(): Promise<UserInterface[]> {
        const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM users')
        return rows as UserInterface[]
    }

    async getById(id: number): Promise<UserInterface> {
        const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id])
        const booking = rows[0] as UserInterface
        if (!booking) {
            throw new Error(`User with id: ${id} not found`)
        }
        return booking as UserInterface
    }

    async getByUsername(username: string): Promise<UserInterface> {
        if (!username) {
            throw new Error("Username cannot be empty.")
        }
        const [rows] = await this.connection.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [username])

        if (!rows || rows.length === 0) {
            throw new Error(`User with username: ${username} not found`)
        }

        const user = rows[0] as UserInterface
        return user as UserInterface
    }

    async create(newUser: UserInterface): Promise<UserInterface> {
        if (Object.keys(newUser).length === 0) {
            throw new Error("No fields to update.")
        }

        const columns = Object.keys(newUser).join(', ')
        const placeholders = Object.keys(newUser).map(() => '?').join(', ')

        const values = Object.values(newUser)

        const query = `INSERT INTO users (${columns}) VALUES (${placeholders})`

        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values)

            const createdUser = { ...newUser, id: result.insertId }
            return createdUser
        } catch (error) {
            console.error('Error creating user:', error)
            throw new Error('Failed to create user')
        }
    }

    async update(id: number, updatedUser: Partial<UserInterface>): Promise<UserInterface> {
        if (Object.keys(updatedUser).length === 0) {
            throw new Error("No fields to update.")
        }


        const columns = Object.keys(updatedUser)
            .map(key => `${key} = ?`)
            .join(', ')


        const values = Object.values(updatedUser)

        values.push(id)

        const query = `UPDATE users SET ${columns} WHERE id = ?`

        try {
            const [result] = await this.connection.execute<mysql.ResultSetHeader>(query, values)
            if (result.affectedRows === 0) {
                throw new Error(`User with id: ${id} not found`)
            }
            return this.getById(id)
        } catch (error) {
            console.error('Error updating user:', error)
            throw new Error('Failed to update user')
        }
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await this.connection.execute<mysql.ResultSetHeader>('DELETE FROM users WHERE id = ?', [id])
        return result.affectedRows > 0
    }
}