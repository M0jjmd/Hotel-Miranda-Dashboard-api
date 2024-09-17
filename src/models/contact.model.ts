import mongoose, { Schema, Document, model } from 'mongoose'
import { ContactInterface } from '../interfaces/contactInterface'

export interface ContactDocument extends Document, ContactInterface { }

const ContactSchema: Schema<ContactDocument> = new Schema({
    id: { type: String, required: true },
    date: { type: String, required: true },
    customer: {
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

export default model<ContactDocument>('Contact', ContactSchema)
