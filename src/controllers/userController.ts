import { Request, Response, Router } from 'express'
import { UserService } from '../services/userService'
import { UserInterface } from '../interfaces/userInterface'
import { UserDocument } from '../models/user.model'
import bcrypt from 'bcrypt'

export const usersController = Router()

usersController.get("", async (req: Request, res: Response) => {
    const userService = new UserService()
    try {
        const users = await userService.getAll()
        return res.status(200).send(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return res.status(500).send({ error: 'Error fetching users' })
    }
})

usersController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const userService = new UserService()
    try {
        const user = await userService.getById(req.params.id)
        return res.status(200).send(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        return res.status(500).send({ error: 'Error fetching user' })
    }
})

usersController.post("", async (req: Request, res: Response) => {
    const userService = new UserService()
    const newUser: Omit<UserDocument, '_id'> = req.body

    if (newUser.password) {
        try {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(newUser.password, saltRounds)
            newUser.password = hashedPassword
        } catch (error) {
            return res.status(500).send({ error: "Error hashing the password" })
        }

        try {
            const createdUser = await userService.create(newUser)
            return res.status(201).send(createdUser)
        } catch (error) {
            return res.status(500).send({ error: "Error creating the user" })
        }
    }
})

usersController.put("/:id", async (req: Request<{ id: string }, {}, UserInterface>, res: Response) => {
    const userService = new UserService()
    const userId = req.params.id
    const updatedUserData: UserInterface = req.body

    try {
        const updatedUser = await userService.update(userId, updatedUserData)
        if (updatedUser) {
            return res.status(200).send(updatedUser)
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