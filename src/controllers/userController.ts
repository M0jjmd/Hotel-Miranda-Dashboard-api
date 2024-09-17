import express from 'express'
import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { UserInterface } from '../interfaces/userInterface'
import { createHash } from 'crypto'
import { UserDocument } from '../models/user.model'

export const usersController = express.Router()

usersController.get("", async (req: Request, res: Response) => {
    const userService = new UserService()
    try {
        const users = await userService.getAll()
        return res.status(200).send({ data: users })
    } catch (error) {
        console.error('Error fetching users:', error)
        return res.status(500).send({ error: 'Error fetching users' })
    }
})

usersController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService()
    try {
        const user = await userService.getById(req.params.id)
        return res.status(200).send({ data: user })
    } catch (error) {
        console.error('Error fetching user:', error)
        return res.status(500).send({ error: 'Error fetching user' })
    }
})

usersController.post("", async (req: Request, res: Response) => {
    const userService = new UserService()
    const newUser: Omit<UserDocument, '_id'> = req.body

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
        const successfulDelete = await userService.delete(userId)
        if (successfulDelete) {
            return res.status(200).send({ message: "User deleted successfully" })
        } else {
            return res.status(404).send({ message: "User not found" })
        }

    } catch (error) {
        return res.status(500).send({ error: "Error deleting the user" })
    }
})