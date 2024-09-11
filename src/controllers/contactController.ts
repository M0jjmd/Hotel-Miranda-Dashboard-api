import { Request, Response, Router } from 'express'
import { ContactService } from '../services/contactService'
import { ContactInterface, UpdateArchiveStatusPayload } from '../interfaces/contactInterface'
import { authenticateTokenMiddleware } from '../middleware/auth'

export const contactsController = Router()

contactsController.use(authenticateTokenMiddleware)

contactsController.get("", async (req: Request, res: Response) => {
    const contactService = new ContactService()
    return res.status(200).send({ data: contactService.getAll() })
})

contactsController.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const contactService = new ContactService()
    return res.send({ data: contactService.getById(req.params.id) })
})

contactsController.post("", async (req: Request, res: Response) => {
    const contactService = new ContactService()
    const newContact: ContactInterface = req.body

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
        const isDeleted = await contactService.delete(contactId)
        if (isDeleted) {
            return res.status(200).send({ message: "Contact deleted successfully" })
        } else {
            return res.status(404).send({ message: "Contact not found" })
        }
    } catch (error) {
        return res.status(500).send({ error: "Error deleting the contact" })
    }
})