import express from 'express'
import { loginController } from './src/controllers/loginController'
import { roomsController } from './src/controllers/roomController'
import { bookingsController } from './src/controllers/bookingController'
import { contactsController } from './src/controllers/contactController'
import { usersController } from './src/controllers/userController'
import { authenticateTokenMiddleware } from './src/middleware/auth'

const app = express()

app.use(express.json())

app.use('/lognUser', loginController)
app.use('/users', authenticateTokenMiddleware, usersController)
app.use('/rooms', authenticateTokenMiddleware, roomsController)
app.use('/bookings', authenticateTokenMiddleware, bookingsController)
app.use('/contacts', authenticateTokenMiddleware, contactsController)

export default app