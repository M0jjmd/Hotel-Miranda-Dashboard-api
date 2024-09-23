import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
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
        await seedUsers()
        await seedBookings()
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

async function seedUsers() {
    const users: UserInterface[] = []

    const saltRounds = 10
    const password = 'miContraseñaSegura'
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    users.push({
        username: 'johndoe',
        FullName: 'John Doe',
        password: hashedPassword,
        Email: 'johndoe@example.com',
        Photo: faker.image.avatar(),
        EntryDate: new Date(),
        PositionDescription: 'Manager',
        Phone: '1234567890',
        State: 'active',
        position: 'manager',
    })

    for (let i = 0; i < 10; i++) {
        users.push({
            username: faker.internet.userName(),
            FullName: faker.person.fullName(),
            password: faker.internet.password(),
            Email: faker.internet.email(),
            Photo: faker.image.avatar(),
            EntryDate: faker.date.past(),
            PositionDescription: faker.lorem.sentence(),
            Phone: faker.phone.number(),
            State: faker.helpers.arrayElement(['active', 'inactive']),
            position: faker.helpers.arrayElement(['receptionist', 'manager', 'cleaner']),
        });
    }
    await User.insertMany(users);
}

async function seedBookings() {
    const rooms = await Room.find()
    const users = await User.find()
    const bookings: BookingInterface[] = []
    for (let i = 0; i < 10; i++) {
        const randomRoom = faker.helpers.arrayElement(rooms)
        const randomUser = faker.helpers.arrayElement(users)
        bookings.push({
            Guest: {
                UserId: randomUser._id,
                RoomId: randomRoom._id,
            },
            OrderDate: faker.date.past(),
            CheckIn: faker.date.future(),
            CheckOut: faker.date.future(),
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

async function seedContacts() {
    const users = await User.find()
    const contacts: ContactInterface[] = []
    for (let i = 0; i < 10; i++) {
        const randomUser = faker.helpers.arrayElement(users)
        contacts.push({
            date: faker.date.past(),
            customer: {
                userId: randomUser._id,
                name: randomUser.FullName,
                email: randomUser.Email,
                phone: randomUser.Phone,
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