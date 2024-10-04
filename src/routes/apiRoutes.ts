import { Request, Response, NextFunction, Router } from 'express'
import mysql from 'mysql2/promise'
import { loginController } from '../controllers/loginController'
import { usersController } from '../controllers/userController'
import { contactsController } from '../controllers/contactController'
import { roomsController } from '../controllers/roomController'
import { bookingsController } from '../controllers/bookingController'
import { authenticateTokenMiddleware } from '../middleware/authMiddleware'


const createRoutes = (connection: mysql.Connection) => {
    const router = Router()
    router.post('/login', (req: Request, res: Response) => {
        const controller = loginController(connection)
        return controller(req, res)
    })

    router.use('/users', authenticateTokenMiddleware, usersController(connection))
    router.use('/contacts', authenticateTokenMiddleware, contactsController(connection))
    router.use('/rooms', authenticateTokenMiddleware, roomsController(connection))
    router.use('/bookings', authenticateTokenMiddleware, bookingsController(connection))

    const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err)
        res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
    }

    router.use(errorHandler)

    return router
}

export default createRoutes