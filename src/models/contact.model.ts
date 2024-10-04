import { Schema, model, Document } from 'mongoose'
import { ContactInterface } from '../interfaces/contactInterface'

export interface ContactDocument extends Document, ContactInterface {
    _id: string
}

const ContactSchema: Schema<ContactDocument> = new Schema({
    date: { type: Date, required: true },
    customer: {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    subject: { type: String, required: true },
    comment: { type: String, required: true },
    actions: {
        archive: { type: Boolean, required: true }
    }
})

const Contact = model<ContactDocument>('Contact', ContactSchema)
export default Contact