import { Request, Response, Router } from 'express'
import { ContactService } from '../services/contactService'
import { UpdateArchiveStatusPayload } from '../interfaces/contactInterface'
import { ContactDocument } from '../models/contact.model'

export const contactsController = Router()

contactsController.get("", async (req: Request, res: Response) => {
    const contactService = new ContactService()
    try {
        const contacts = await contactService.getAll()
        return res.status(200).send({ data: contacts })
    } catch (error) {
        console.error('Error fetching contacts:', error)
        return res.status(500).send({ error: 'Error fetching contacts' })
    }
})

contactsController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const contactService = new ContactService()
    try {
        const contact = await contactService.getById(req.params.id)
        return res.status(200).send({ data: contact })
    } catch (error) {
        console.error('Error fetching contact:', error)
        return res.status(500).send({ error: 'Error fetching contact' })
    }
})

contactsController.post("", async (req: Request, res: Response) => {
    const contactService = new ContactService()
    const newContact: Omit<ContactDocument, '_id'> = req.body

    try {
        const createdContact = await contactService.create(newContact)
        return res.status(201).send({ data: createdContact })
    } catch (error) {
        return res.status(500).send({ error: "Error creating the contact" })
    }
})

contactsController.patch("/archive-status", async (req: Request, res: Response) => {
    const contactService = new ContactService()
    const payload: UpdateArchiveStatusPayload = req.body

    try {
        const updatedContact = await contactService.updateArchiveStatus(payload)
        if (updatedContact) {
            return res.status(200).send({ data: updatedContact })
        } else {
            return res.status(404).send({ message: "Contact not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error updating archive status" })
    }
})

contactsController.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const contactService = new ContactService()
    const contactId = req.params.id

    try {
        const successfulDelete = await contactService.delete(contactId)
        if (successfulDelete) {
            return res.status(200).send({ message: "Contact deleted successfully" })
        } else {
            return res.status(404).send({ message: "Contact not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error deleting the contact" })
    }
})