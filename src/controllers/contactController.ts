import { Request, Response, Router } from 'express'
import { ContactServices } from '../services/contactServices'
import { UpdateArchiveStatusPayload } from '../interfaces/contactInterface'
import mysql from 'mysql2/promise'

export const contactsController = (connection: mysql.Connection) => {
    const contactController = Router()

    const contactService = new ContactServices(connection)

    contactController.get("", async (req: Request, res: Response) => {
        try {
            const contacts = await contactService.getAll()
            return res.status(200).send(contacts)
        } catch (error) {
            console.error('Error fetching contacts:', error)
            return res.status(500).send({ error: 'Error fetching contacts' })
        }
    })

    contactController.get("/:id", async (req: Request<{ id: number }>, res: Response) => {
        try {
            const contact = await contactService.getById(req.params.id)
            return res.status(200).send(contact)
        } catch (error) {
            console.error('Error fetching contact:', error)
            return res.status(500).send({ error: 'Error fetching contact' })
        }
    })

    // contactController.post("", async (req: Request, res: Response) => {
    //     const newContact: ContactInterface = req.body

    //     try {
    //         const createdContact = await contactService.create(newContact)
    //         return res.status(201).send(createdContact)
    //     } catch (error) {
    //         return res.status(500).send({ error: "Error creating the contact" })
    //     }
    // })

    contactController.patch("/:id/archive-status", async (req: Request, res: Response) => {
        const payload: UpdateArchiveStatusPayload = {
            id: req.params.id,
            archiveStatus: req.body.actions.archive
        }

        try {
            const updatedContact = await contactService.updateArchiveStatus(payload)
            if (updatedContact) {
                return res.status(200).send(updatedContact)
            } else {
                return res.status(404).send({ message: "Contact not found" })
            }
        } catch (error) {
            console.error('Error updating archive status:', error)
            return res.status(500).send({ error: "Error updating archive status" })
        }
    })

    contactController.delete("/:id", async (req: Request<{ id: number }>, res: Response) => {
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
    return contactController
}