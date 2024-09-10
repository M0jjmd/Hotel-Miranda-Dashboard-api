import express from 'express'
import { roomsController } from './controllers/roomController'
import { bookingsController } from './controllers/bookingController'
import { contactsController } from './controllers/contactController'
import { usersController } from './controllers/userController'

const app = express()
const port = 3000

app.use(express.json())

app.use(express.json());

app.use('/users', usersController);

app.use('/rooms', roomsController);

app.use('/bookings', bookingsController);

app.use('/contacts', contactsController);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})