import express from 'express'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export const loginController = express.Router()

loginController.post('/login', async (req: Request, res: Response) => {
    const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key'
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password || '')

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const payload = { username }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })

        return res.status(200).json({
            token,
            name: user.FullName,
            email: user.Email,
            id: user._id,
        })

    } catch (error) {
        console.error('Error during login:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})