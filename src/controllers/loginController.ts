import express from 'express'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { createHash } from 'crypto'

export const loginController = express.Router()

loginController.post('/login', (req: Request, res: Response) => {
    const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key'
    const { username, password } = req.body
    const encrptPswrdReq = createHash('sha256').update(password!).digest('hex')
    const encryptPswrd = createHash('sha256').update('password123'!).digest('hex')

    if (username === 'admin' && encrptPswrdReq === encryptPswrd) {
        const payload = {
            username,
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
        return res.status(200).json({ token })
    } else {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
})