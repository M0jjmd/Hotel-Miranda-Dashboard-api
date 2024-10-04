import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { UserServices } from '../services/userServices'
import mysql from 'mysql2/promise'

export const loginController = (connection: mysql.Connection) => {
    return async (req: Request, res: Response) => {
        const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key'
        const { username, password } = req.body
        const userService = new UserServices(connection)

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' })
        }

        try {
            const user = await userService.getByUsername(username)

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }

            if (!user.password) {
                return res.status(500).json({ message: 'User does not have a password set' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }

            const payload = { username }
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })

            return res.status(200).json({
                token,
                name: user.fullname,
                email: user.email,
                id: user.id,
            })

        } catch (error) {
            console.error('Error during login:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}