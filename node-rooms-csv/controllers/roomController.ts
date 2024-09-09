// src/controllers/roomController.ts
import { Request, Response, Router } from 'express';
import { RoomService } from '../services/roomService';
import { RoomInterface } from '../interfaces/roomInterface';

export const roomsController = Router()

roomsController.get("", async (req: Request, res: Response) => {
    const roomService = new RoomService()
    return res.send({ data: roomService.getAll()})
})
// export const getAllRooms = (req: Request, res: Response): void => {
//     const rooms = roomService.getAll();
//     res.status(200).json(rooms);
// };

// Obtener una habitación por ID



// import { Request, Response, Router } from 'express'
// import { RoomService } from '../services/roomService'
// export const roomController = Router()