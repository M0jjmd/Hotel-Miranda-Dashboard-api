import express from 'express'
import { authenticateTokenMiddleware } from './src/middleware/auth'
import { roomsController } from './src/controllers/roomController'
import { bookingsController } from './src/controllers/bookingController'
import { contactsController } from './src/controllers/contactController'
import { usersController } from './src/controllers/userController'

const app = express()

app.use(express.json())

app.use('/users', usersController)
app.use('/rooms', authenticateTokenMiddleware, roomsController)
app.use('/bookings', authenticateTokenMiddleware, bookingsController)
app.use('/contacts', authenticateTokenMiddleware, contactsController)

export default app