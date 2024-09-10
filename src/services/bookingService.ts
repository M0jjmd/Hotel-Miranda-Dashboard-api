import dataBookings from '../../apiData.json'
import { BookingInterface } from '../interfaces/bookingInterface'

const bookings: BookingInterface[] = dataBookings.bookings

export class BookingService {
    getAll(): BookingInterface[] {
        return bookings
    }

    getById(id: string): BookingInterface | null {
        const booking = bookings.find((bookingData: BookingInterface) => bookingData.id === id)
        return booking || null
    }

    create(newBooking: BookingInterface): BookingInterface {
        bookings.push(newBooking)
        return newBooking
    }

    update(id: string, updatedBooking: BookingInterface): BookingInterface | null {
        const bookingIndex = bookings.findIndex((booking) => booking.id === id)
        if (bookingIndex !== -1) {
            bookings[bookingIndex] = updatedBooking
            return bookings[bookingIndex]
        }
        return null
    }

    delete(id: string): boolean {
        const bookingIndex = bookings.findIndex((booking) => booking.id === id)
        if (bookingIndex !== -1) {
            bookings.splice(bookingIndex, 1)
            return true
        }
        return false
    }
}