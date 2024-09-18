import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import { RoomInterface } from '../src/interfaces/roomInterface'
import { BookingInterface } from '../src/interfaces/bookingInterface'
import { UserInterface } from '../src/interfaces/userInterface'
import { ContactInterface } from '../src/interfaces/contactInterface'
import User from '../src/models/user.model'
import Booking from '../src/models/booking.model'
import Contact from '../src/models/contact.model'
import Room from '../src/models/room.model'
import connectDB from '../src/config/db'

async function seedDatabase() {
    try {
        await connectDB()
        console.log('Conectado a MongoDB')

        await seedRooms()
        await seedBookings()
        await seedUsers()
        await seedContacts()

        console.log('Datos ficticios añadidos exitosamente')
    } catch (error) {
        console.error('Error al añadir datos', error)
    } finally {
        await mongoose.connection.close()
    }
}

async function seedRooms(): Promise<RoomInterface[]> {
    const rooms: RoomInterface[] = []
    for (let i = 0; i < 10; i++) {
        rooms.push({
            Photo: faker.image.url(),
            RoomNumber: faker.number.int({ min: 100, max: 500 }),
            BedType: faker.helpers.arrayElement(['Single', 'Double', 'Queen', 'King']),
            Facilities: faker.helpers.arrayElements(['WiFi', 'TV', 'Minibar', 'Air Conditioner'], 2),
            Rate: faker.number.int({ min: 5000, max: 20000 }),
            OfferPrice: faker.number.int({ min: 0, max: 100 }),
            Status: faker.helpers.arrayElement(['available', 'booked']),
        })
    }
    const insertedRooms = await Room.insertMany(rooms)
    return insertedRooms
}

async function seedBookings() {
    const rooms = await Room.find()
    const bookings: BookingInterface[] = []
    for (let i = 0; i < 10; i++) {
        const randomRoom = faker.helpers.arrayElement(rooms)
        bookings.push({
            Guest: {
                Name: faker.person.fullName(),
                RoomId: randomRoom._id.toString(),
            },
            OrderDate: faker.date.past().toISOString(),
            CheckIn: faker.date.future().toISOString(),
            CheckOut: faker.date.future().toISOString(),
            SpecialRequest: faker.lorem.sentence(),
            RoomType: {
                Type: faker.helpers.arrayElement(['Single', 'Double', 'Suite']),
                RoomNumber: faker.number.int({ min: 100, max: 500 }).toString(),
            },
            Status: faker.helpers.arrayElement(['checked-in', 'checked-out']),
        })
    }
    await Booking.insertMany(bookings)
}

async function seedUsers() {
    const users: UserInterface[] = [];
    for (let i = 0; i < 10; i++) {
        users.push({
            username: faker.internet.userName(),
            FullName: faker.person.fullName(),
            password: faker.internet.password(),
            Email: faker.internet.email(),
            Photo: faker.image.avatar(),
            EntryDate: faker.date.past().toISOString(),
            PositionDescription: faker.lorem.sentence(),
            Phone: faker.phone.number(),
            State: faker.helpers.arrayElement(['active', 'inactive']),
            position: faker.helpers.arrayElement(['receptionist', 'manager', 'cleaner']),
        });
    }
    await User.insertMany(users);
}

async function seedContacts() {
    const users = await User.find({}).limit(10)
    const contacts: ContactInterface[] = []
    for (let i = 0; i < 10; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        contacts.push({
            date: faker.date.past().toISOString(),
            customer: {
                userId: randomUser._id,
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
            },
            subject: faker.lorem.sentence(),
            comment: faker.lorem.paragraph(),
            actions: {
                archive: faker.datatype.boolean(),
            },
        })
    }
    await Contact.insertMany(contacts)
}

seedDatabase()