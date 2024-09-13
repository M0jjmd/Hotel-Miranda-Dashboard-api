import express from 'express'
import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { UserInterface } from '../interfaces/userInterface'
import { createHash } from 'crypto'

export const usersController = express.Router()

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