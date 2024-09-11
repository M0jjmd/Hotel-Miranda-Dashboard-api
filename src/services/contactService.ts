import dataContacts from '../../apiData.json'
import { ContactInterface, UpdateArchiveStatusPayload } from '../interfaces/contactInterface'

const contacts: ContactInterface[] = dataContacts.contacts

export class ContactService {
    getAll(): ContactInterface[] {
        return contacts
    }

    getById(id: string): ContactInterface {
        const contact = contacts.find((contactData: ContactInterface) => contactData.id === id)
        if (!contact) {
            throw new Error(`Contact with id${id} not found`)
        }
        return contact
    }

    create(newContact: ContactInterface): ContactInterface {
        contacts.push(newContact)
        return newContact
    }

    updateArchiveStatus(payload: UpdateArchiveStatusPayload): ContactInterface {
        const contactIndex = contacts.findIndex((contact) => contact.id === payload.id)
        if (contactIndex !== -1) {
            contacts[contactIndex].actions.archive = payload.archiveStatus
            return contacts[contactIndex]
        }
        return contacts[contactIndex]
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