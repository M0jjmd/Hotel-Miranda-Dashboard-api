import express from 'express'
import { roomsController } from './src/controllers/roomController'
import { bookingsController } from './src/controllers/bookingController'
import { contactsController } from './src/controllers/contactController'
import { usersController } from './src/controllers/userController'

const app = express()

app.use(express.json())

app.use('/users', usersController)
app.use('/rooms', roomsController)
app.use('/bookings', bookingsController)
app.use('/contacts', contactsController)

export default app