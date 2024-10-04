import { Schema, Document, model } from 'mongoose'
import { BookingInterface } from '../interfaces/bookingInterface'

export interface BookingDocument extends Document, BookingInterface {
    _id: string
}

const BookingSchema: Schema<BookingDocument> = new Schema({
    Guest: {
        UserId: { type: String, required: true },
        RoomId: { type: String, required: true }
    },
    OrderDate: { type: Date, required: true },
    CheckIn: { type: Date, required: true },
    CheckOut: { type: Date, required: true },
    SpecialRequest: { type: String, required: true },
    RoomType: {
        Type: { type: String, required: true },
        RoomNumber: { type: String, required: true }
    },
    Status: { type: String, required: true },
})

const Booking = model<BookingDocument>('Booking', BookingSchema)
export default Booking