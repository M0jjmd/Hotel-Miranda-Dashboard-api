import dataContacts from '../../apiData.json'
import { ContactInterface, UpdateArchiveStatusPayload } from '../interfaces/contactInterface'

const contacts: ContactInterface[] = dataContacts.contacts

export class ContactService {
    getAll(): ContactInterface[] {
        return contacts
    }

    getById(id: string): ContactInterface | null {
        const contact = contacts.find((contactData: ContactInterface) => contactData.id === id)
        return contact || null
    }

    create(newContact: ContactInterface): ContactInterface {
        contacts.push(newContact)
        return newContact
    }

    update(id: string, updatedContact: ContactInterface): ContactInterface | null {
        const contactIndex = contacts.findIndex((contact) => contact.id === id)
        if (contactIndex !== -1) {
            contacts[contactIndex] = updatedContact
            return contacts[contactIndex]
        }
        return null
    }

    updateArchiveStatus(payload: UpdateArchiveStatusPayload): ContactInterface | null {
        const contactIndex = contacts.findIndex((contact) => contact.id === payload.id)
        if (contactIndex !== -1) {
            contacts[contactIndex].actions.archive = payload.archiveStatus
            return contacts[contactIndex]
        }
        return null
    }

    delete(id: string): boolean {
        const contactIndex = contacts.findIndex((contact) => contact.id === id)
        if (contactIndex !== -1) {
            contacts.splice(contactIndex, 1)
            return true
        }
        return false
    }
}