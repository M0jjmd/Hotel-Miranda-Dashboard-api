import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response, Router, NextFunction } from 'express'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        (req as any).user = user;

        next()
    })
}

const generateToken = (username: string): string => {
    const payload = {
        username,
    }

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}

const hardcodedUser = {
    username: 'admin',
    password: 'password123'
}

export const authController = Router()

authController.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body

    if (username === hardcodedUser.username && password === hardcodedUser.password) {
        const token = generateToken(username)
        return res.status(200).json({ token })
    } else {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
})
