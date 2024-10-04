import { Request, Response, Router } from 'express'
import { UserServices } from '../services/userServices'
import { UserInterface } from '../interfaces/userInterface'
import bcrypt from 'bcrypt'
import mysql from 'mysql2/promise'

export const usersController = (connection: mysql.Connection) => {
    const userController = Router()

    const userService = new UserServices(connection)

    userController.get("", async (req: Request, res: Response) => {
        try {
            const users = await userService.getAll()
            return res.status(200).send(users)
        } catch (error) {
            console.log(error)
            console.error('Error fetching users:', error)
            return res.status(500).send({ error: 'Error fetching users' })
        }
    })

    userController.get("/:id", async (req: Request<{ id: number }>, res: Response) => {
        try {
            const user = await userService.getById(req.params.id)
            return res.status(200).send(user)
        } catch (error) {
            console.log(error)
            console.error('Error fetching user:', error)
            return res.status(500).send({ error: 'Error fetching user' })
        }
    })

    userController.post("", async (req: Request, res: Response) => {
        const newUser: UserInterface = req.body

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
                console.log(error)
                return res.status(500).send({ error: "Error creating the user" })
            }
        }
    })

    userController.put("/:id", async (req: Request<{ id: number }, {}, UserInterface>, res: Response) => {
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
            console.log(error)
            return res.status(500).send({ error: "Error updating the user" })
        }
    })

    userController.delete("/:id", async (req: Request<{ id: number }>, res: Response) => {
        const userId = req.params.id

        try {
            const successfulDelete = await userService.delete(userId)
            if (successfulDelete) {
                return res.status(200).send({ message: "User deleted successfully" })
            } else {
                return res.status(404).send({ message: "User not found" })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Error deleting the user" })
        }
    })
    return userController
}