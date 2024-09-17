import { Schema, Document, model } from 'mongoose'
import { RoomInterface } from '../interfaces/roomInterface'

export interface RoomDocument extends Document, RoomInterface { }

const UserSchema: Schema<RoomDocument> = new Schema({
    Photo: { type: String, required: true },
    RoomNumber: { type: Number, required: true },
    RoomID: { type: String, required: true },
    BedType: { type: String, required: true },
    Facilities: { type: [String], required: true },
    Rate: { type: Number, required: true },
    OfferPrice: { type: Number, required: true },
    Status: { type: String, required: true },
})

export default model<RoomDocument>('User', UserSchema)