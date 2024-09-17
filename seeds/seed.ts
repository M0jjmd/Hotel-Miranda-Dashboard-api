import { MongoClient } from 'mongodb'
import { faker } from '@faker-js/faker'
import { RoomInterface } from '../src/interfaces/roomInterface'
import { BookingInterface } from '../src/interfaces/bookingInterface'
import { UserInterface } from '../src/interfaces/userInterface'
import User from '../src/models/user.model'
import { ContactInterface } from '../src/interfaces/contactInterface'

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

const dbName = 'hotelMirandaDB'

async function seedDatabase() {
    try {
        await client.connect()
        console.log('Conectado a MongoDB')
        const db = client.db(dbName)

        await seedRooms(db)
        await seedBookings(db)
        await seedUsers(db)
        await seedContacts(db)

        console.log('Datos ficticios añadidos exitosamente')
    } catch (error) {
        console.error('Error al añadir datos', error)
    } finally {
        await client.close()
    }
}

async function seedRooms(db: any) {
    const rooms: RoomInterface[] = []
    for (let i = 0; i < 10; i++) {
        rooms.push({
            Photo: faker.image.url(),
            RoomNumber: faker.number.int({ min: 100, max: 500 }),
            RoomID: faker.string.uuid(),
            BedType: faker.helpers.arrayElement(['Single', 'Double', 'Queen', 'King']),
            Facilities: faker.helpers.arrayElements(['WiFi', 'TV', 'Minibar', 'Air Conditioner'], 2),
            Rate: faker.number.int({ min: 5000, max: 20000 }),
            OfferPrice: faker.number.int({ min: 0, max: 100 }),
            Status: faker.helpers.arrayElement(['available', 'booked', 'maintenance']),
            id: faker.string.uuid(),
        })
    }
    await db.collection('rooms').insertMany(rooms)
}

async function seedBookings(db: any) {
    const bookings: BookingInterface[] = []
    for (let i = 0; i < 10; i++) {
        bookings.push({
            Guest: {
                Name: faker.name.fullName(),
                ReservationID: faker.string.uuid(),
            },
            OrderDate: faker.date.past().toISOString(),
            CheckIn: faker.date.future().toISOString(),
            CheckOut: faker.date.future().toISOString(),
            SpecialRequest: faker.lorem.sentence(),
            RoomType: {
                Type: faker.helpers.arrayElement(['Single', 'Double', 'Suite']),
                RoomNumber: faker.number.int({ min: 100, max: 500 }).toString(),
            },
            Status: faker.helpers.arrayElement(['confirmed', 'cancelled', 'checked-in', 'checked-out']),
            id: faker.string.uuid(),
        })
    }
    await db.collection('bookings').insertMany(bookings)
}

async function seedUsers(db: any) {
    const users: UserInterface[] = [];
    for (let i = 0; i < 10; i++) {
        users.push({
            username: faker.internet.userName(),
            FullName: faker.name.fullName(),
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

async function seedContacts(db: any) {
    const contacts: ContactInterface[] = []
    for (let i = 0; i < 10; i++) {
        contacts.push({
            id: faker.string.uuid(),
            date: faker.date.past().toISOString(),
            customer: {
                name: faker.name.fullName(),
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
    await db.collection('contact').insertMany(contacts)
}

seedDatabase()