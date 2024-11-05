import dotenv from "dotenv"
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../interfaces/userInterface'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload
    }
}

const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key'

export const authenticateTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token is required' })
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err)
            return res.status(403).json({ message: 'Token is invalid' })
        }
        const payload = decoded as JwtPayload
        req.user = payload

        next()
    })
}