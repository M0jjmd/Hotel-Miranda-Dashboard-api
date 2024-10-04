import { Request, Response, Router } from 'express'
import { BookingServices } from '../services/bookingServices'
import { BookingInterface } from '../interfaces/bookingInterface'
import mysql from 'mysql2/promise'

export const bookingsController = (connection: mysql.Connection) => {
    const bookingController = Router()

    const bookingService = new BookingServices(connection)

    bookingController.get("", async (req: Request, res: Response) => {
        try {
            const bookings = await bookingService.getAll()
            return res.status(200).send(bookings)
        } catch (error) {
            console.error('Error fetching bookings:', error)
            return res.status(500).send({ error: 'Error fetching bookings' })
        }
    })

    bookingController.get("/:id", async (req: Request<{ id: number }>, res: Response) => {
        try {
            const booking = await bookingService.getById(req.params.id)
            return res.status(200).send(booking)
        } catch (error) {
            console.error('Error fetching booking:', error)
            return res.status(500).send({ error: 'Error fetching booking' })
        }
    })

    bookingController.post("", async (req: Request, res: Response) => {
        const newBooking: BookingInterface = req.body

        try {
            const createdBooking = await bookingService.create(newBooking)
            return res.status(201).send(createdBooking)
        } catch (error) {
            return res.status(500).send({ error: "Error creating the booking" + error })
        }
    })

    bookingController.put("/:id", async (req: Request<{ id: number }, {}, BookingInterface>, res: Response) => {
        const bookingId = req.params.id
        const updatedBookingData: BookingInterface = req.body

        try {
            const updatedBooking = await bookingService.update(bookingId, updatedBookingData)
            if (updatedBooking) {
                return res.status(200).send(updatedBooking)
            } else {
                return res.status(404).send({ message: "Booking not found" })
            }
        } catch (error) {
            return res.status(500).send({ error: "Error updating the booking" })
        }
    })

    bookingController.delete("/:id", async (req: Request<{ id: number }>, res: Response) => {
        const bookingId = req.params.id

        try {
            const successfulDelete = await bookingService.delete(bookingId)
            if (successfulDelete) {
                return res.status(200).send({ message: "Booking deleted successfully" })
            } else {
                return res.status(404).send({ message: "Booking not found" })
            }

        } catch (error) {
            return res.status(500).send({ error: "Error deleting the booking" })
        }
    })
    return bookingController
}