import { Request, Response, Router } from 'express'
import { BookingService } from '../services/bookingService'
import { BookingInterface } from '../interfaces/bookingInterface'

export const bookingsController = Router()

bookingsController.get("", async (req: Request, res: Response) => {
    const bookingService = new BookingService()
    return res.status(200).send({ data: bookingService.getAll() })
})

bookingsController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const bookingService = new BookingService()
    return res.send({ data: bookingService.getById(req.params.id) })
})

bookingsController.post("", async (req: Request, res: Response) => {
    const bookingService = new BookingService()
    const newBooking: BookingInterface = req.body

    try {
        const createdBooking = await bookingService.create(newBooking)
        return res.status(201).send({ data: createdBooking })
    } catch (error) {
        return res.status(500).send({ error: "Error creating the booking" })
    }
})

bookingsController.put("/:id", async (req: Request<{ id: string }, {}, BookingInterface>, res: Response) => {
    const bookingService = new BookingService()
    const bookingId = req.params.id
    const updatedBookingData: BookingInterface = req.body

    try {
        const updatedBooking = await bookingService.update(bookingId, updatedBookingData)
        if (updatedBooking) {
            return res.status(200).send({ data: updatedBooking })
        } else {
            return res.status(404).send({ message: "Booking not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error updating the booking" })
    }
})

bookingsController.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const bookingService = new BookingService()
    const bookingId = req.params.id

    try {
        await bookingService.delete(bookingId)
        return res.status(200).send({ message: "Booking deleted successfully" })
    } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).send({ message: error.message })
        } else {
            return res.status(500).send({ error: "Error deleting the booking" })
        }
    }
})