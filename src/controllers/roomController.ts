import { Request, Response, Router } from 'express'
import { RoomService } from '../services/roomService'
import { RoomInterface } from '../interfaces/roomInterface'
import { RoomDocument } from '../models/room.model'

export const roomsController = Router()

roomsController.get("", async (req: Request, res: Response) => {
    const roomService = new RoomService()
    return res.status(200).send({ data: roomService.getAll() })
})

roomsController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const userService = new RoomService()
    console.log(req.params)
    return res.send({ data: userService.getById(req.params.id) })

})

roomsController.post("", async (req: Request, res: Response) => {
    const roomService = new RoomService()
    const newRoom: Omit<RoomDocument, '_id'> = req.body

    try {
        const createdRoom = await roomService.create(newRoom)
        return res.status(201).send({ data: createdRoom })
    } catch (error) {
        return res.status(500).send({ error: "Error creating the room" })
    }
})

roomsController.put("/:id", async (req: Request<{ id: string }, {}, RoomInterface>, res: Response) => {
    const roomService = new RoomService()
    const roomId = req.params.id
    const updatedRoomData: RoomInterface = req.body

    try {
        const updatedRoom = await roomService.update(roomId, updatedRoomData)
        if (updatedRoom) {
            return res.status(200).send({ data: updatedRoom })
        } else {
            return res.status(404).send({ message: "Room not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error updating the room" })
    }
})

roomsController.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const roomService = new RoomService()
    const roomId = req.params.id

    try {
        const successfulDelete = await roomService.delete(roomId)
        if (successfulDelete) {
            return res.status(200).send({ message: "Room deleted successfully" })
        } else {
            return res.status(404).send({ message: "Room not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error deleting the room" })
    }
})