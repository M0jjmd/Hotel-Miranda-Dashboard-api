import { UpdateArchiveStatusPayload } from '../interfaces/contactInterface'
import { ContactDocument } from '../models/contact.model'
import Contact from '../models/contact.model'

export class ContactService {
    async getAll(): Promise<ContactDocument[]> {
        return Contact.find().exec()
    }

    async getById(id: string): Promise<ContactDocument> {
        const contact = await Contact.findById(id).exec()
        if (!contact) {
            throw new Error(`Contact with id: ${id} not found`)
        }
        return contact
    }

    async create(newContact: Omit<ContactDocument, '_id'>): Promise<ContactDocument> {
        const contact = new Contact(newContact)
        return contact.save()
    }

    async updateArchiveStatus(payload: UpdateArchiveStatusPayload): Promise<ContactDocument> {
        const { id, archiveStatus } = payload
        const contact = await Contact.findById(id).exec()
        if (!contact) {
            throw new Error(`Contact with id: ${id} not found`)
        }
        contact.actions.archive = archiveStatus
        return contact.save()
    }

    async delete(id: string): Promise<boolean> {
        const result = await Contact.findByIdAndDelete(id).exec()
        return result !== null
    }
}