import express from 'express'
import jwt from 'jsonwebtoken'
import { Request, Response, Router } from 'express'
import { UserService } from '../services/userService'
import { UserInterface } from '../interfaces/userInterface'
import { createHash } from 'crypto'
import { authenticateTokenMiddleware } from '../middleware/auth'

export const usersController = express.Router()

usersController.post('/login', (req: Request, res: Response) => {
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

usersController.use(authenticateTokenMiddleware)

usersController.get("", async (req: Request, res: Response) => {
    const userService = new UserService()
    return res.status(200).send({ data: userService.getAll() })
})

usersController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService()
    console.log(req.params)
    return res.send({ data: userService.getById(req.params.id) })

})

usersController.post("", async (req: Request, res: Response) => {
    const userService = new UserService()
    const newUser: UserInterface = req.body

    if (newUser.password) {
        const hashedPassword = createHash('sha256').update(newUser.password).digest('hex')
        newUser.password = hashedPassword
    }

    try {
        const createdUser = await userService.create(newUser)
        return res.status(201).send({ data: createdUser })
    } catch (error) {
        return res.status(500).send({ error: "Error creating the user" })
    }
})

usersController.put("/:id", async (req: Request<{ id: string }, {}, UserInterface>, res: Response) => {
    const userService = new UserService()
    const userId = req.params.id
    const updatedUserData: UserInterface = req.body

    try {
        const updatedUser = await userService.update(userId, updatedUserData)
        if (updatedUser) {
            return res.status(200).send({ data: updatedUser })
        } else {
            return res.status(404).send({ message: "User not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error updating the user" })
    }
})


usersController.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService()
    const userId = req.params.id

    try {
        await userService.delete(userId)
        return res.status(200).send({ message: "User deleted successfully" })
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).send({ message: error.message })
        } else {
            return res.status(500).send({ error: "Error deleting the user" })
        }
    }
})