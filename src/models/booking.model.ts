import { Schema, Document, model } from 'mongoose'
import { BookingInterface } from '../interfaces/bookingInterface'
import { models } from 'mongoose'

export interface BookingDocument extends Document, BookingInterface { }

const BookingSchema: Schema<BookingDocument> = new Schema({
    Guest: {
        Name: { type: String, required: true },
        ReservationID: { type: String, required: true }
    },
    OrderDate: { type: String, required: true },
    CheckIn: { type: String, required: true },
    CheckOut: { type: String, required: true },
    SpecialRequest: { type: String, required: true },
    RoomType: {
        Type: { type: String, required: true },
        RoomNumber: { type: String, required: true }
    },
    Status: { type: String, required: true },
})

const Booking = models.Booking || model<BookingDocument>('Booking', BookingSchema)
export default Booking
// export default model<BookingDocument>('Booking', BookingSchema)
