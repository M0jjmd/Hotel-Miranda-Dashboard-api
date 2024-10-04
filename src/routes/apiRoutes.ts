import { Request, Response, NextFunction, Router } from 'express'
import { loginController } from '../controllers/loginController'
import { usersController } from '../controllers/userController'
import { contactsController } from '../controllers/contactController'
import { roomsController } from '../controllers/roomController'
import { bookingsController } from '../controllers/bookingController'
import { authenticateTokenMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.post('/login', loginController)

router.use('/users', authenticateTokenMiddleware, usersController)
router.use('/contacts', authenticateTokenMiddleware, contactsController)
router.use('/rooms', authenticateTokenMiddleware, roomsController)
router.use('/bookings', authenticateTokenMiddleware, bookingsController)

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
}

router.use(errorHandler)

export default router