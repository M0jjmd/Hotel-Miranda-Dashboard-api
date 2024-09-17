import { BookingDocument } from '../models/booking.model'
import Booking from '../models/booking.model'

export class BookingService {
    async getAll(): Promise<BookingDocument[]> {
        return Booking.find().exec()
    }

    async getById(id: string): Promise<BookingDocument> {
        const booking = await Booking.findById(id).exec()
        if (!booking) {
            throw new Error(`User with id: ${id} not found`)
        }
        return booking
    }

    async create(newBooking: Omit<BookingDocument, '_id'>): Promise<BookingDocument> {
        const booking = new Booking(newBooking)
        return booking.save()
    }

    async update(id: string, updatedBooking: Partial<Omit<BookingDocument, '_id'>>): Promise<BookingDocument> {
        const booking = await Booking.findByIdAndUpdate(id, updatedBooking, { new: true }).exec()
        if (!booking) {
            throw new Error(`Room with id: ${id} not found`)
        }
        return booking
    }

    async delete(id: string): Promise<boolean> {
        const result = await Booking.findByIdAndDelete(id).exec()
        return result !== null
    }
}