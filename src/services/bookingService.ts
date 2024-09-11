import dataBookings from '../../apiData.json'
import { BookingInterface } from '../interfaces/bookingInterface'

const bookings: BookingInterface[] = dataBookings.bookings

export class BookingService {
    getAll(): BookingInterface[] {
        return bookings
    }

    getById(id: string): BookingInterface {
        const booking = bookings.find((bookingData: BookingInterface) => bookingData.id === id)
        if (!booking) {
            throw new Error(`Booking with id: ${id} not found`)
        }
        return booking
    }

    create(newBooking: BookingInterface): BookingInterface {
        bookings.push(newBooking)
        return newBooking
    }

    update(id: string, updatedBooking: BookingInterface): BookingInterface {
        const bookingIndex = bookings.findIndex((booking) => booking.id === id)
        if (bookingIndex !== -1) {
            bookings[bookingIndex] = updatedBooking
            return bookings[bookingIndex]
        }
        return bookings[bookingIndex]
    }

    delete(id: string): void {
        const bookingIndex = bookings.findIndex((booking) => booking.id === id)
        if (bookingIndex === -1) {
            throw new Error(`Booking with id: ${id} not found`)
        }
        bookings.splice(bookingIndex, 1)
    }
}