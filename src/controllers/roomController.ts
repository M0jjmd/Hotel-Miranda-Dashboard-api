import { Request, Response, Router } from 'express'
import { RoomServices } from '../services/roomServices'
import { Facility, RoomInterface } from '../interfaces/roomInterface'
import mysql from 'mysql2/promise'

export const roomsController = (connection: mysql.Connection) => {
    const roomController = Router()

    const roomService = new RoomServices(connection)

    roomController.get("", async (req: Request, res: Response) => {
        try {
            const rooms = await roomService.getAll()
            return res.status(200).send(rooms)
        } catch (error) {
            console.log(error)
            console.error('Error fetching rooms:', error)
            return res.status(500).send({ error: 'Error fetching rooms' })
        }
    })

    roomController.get("/:id", async (req: Request<{ id: number }>, res: Response) => {
        try {
            const room = await roomService.getById(req.params.id)
            return res.status(200).send(room)
        } catch (error) {
            console.log(error)
            console.error('Error fetching room:', error)
            return res.status(500).send({ error: 'Error fetching room' })
        }

    })

    roomController.post("", async (req: Request, res: Response) => {
        const newRoom: RoomInterface = req.body
        const facilityIds: number[] = req.body.facilities

        if (!facilityIds || facilityIds.length === 0) {
            return res.status(400).send({ error: "Facilities are required." })
        }

        try {
            const createdRoom = await roomService.create(newRoom, facilityIds)
            return res.status(201).send(createdRoom)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Error creating the room" + error })
        }
    })

    roomController.put("/:id", async (req: Request<{ id: number }, {}, RoomInterface>, res: Response) => {
        const roomId = req.params.id
        const updatedRoomData: RoomInterface = req.body

        try {
            const updatedRoom = await roomService.update(roomId, updatedRoomData)
            if (updatedRoom) {
                return res.status(200).send(updatedRoom)
            } else {
                return res.status(404).send({ message: "Room not found" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Error updating the room" })
        }
    })

    roomController.delete("/:id", async (req: Request<{ id: number }>, res: Response) => {
        const roomId = req.params.id

        try {
            const successfulDelete = await roomService.delete(roomId)
            if (successfulDelete) {
                return res.status(200).send({ message: "Room deleted successfully" })
            } else {
                return res.status(404).send({ message: "Room not found" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: "Error deleting the room" })
        }
    })
    return roomController
}