import mysql, { ResultSetHeader } from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { RoomInterface } from '../src/interfaces/roomInterface'
import { BookingInterface } from '../src/interfaces/bookingInterface'
import { UserInterface } from '../src/interfaces/userInterface'
import { ContactInterface } from '../src/interfaces/contactInterface'
import connectDB from '../src/config/db'

async function createTables(connection: mysql.Connection) {
    await connection.query(`CREATE DATABASE IF NOT EXISTS dashboardDB`)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            fullname VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            photo VARCHAR(255),
            entry_date DATE NOT NULL,
            position_description VARCHAR(100) NOT NULL,
            phone VARCHAR(25) NOT NULL,
            state ENUM('active', 'inactive') NOT NULL,
            position VARCHAR(50) NOT NULL
        )
    `)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            photo VARCHAR(255) NOT NULL,
            room_number INT NOT NULL,
            bed_type ENUM('Single', 'Double', 'Queen', 'King') NOT NULL,
            rate INT NOT NULL,
            offer_price INT NOT NULL,
            status ENUM('available', 'booked') NOT NULL
        )
    `)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS facilities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            facility_name VARCHAR(100) NOT NULL
        )
    `)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS room_facilities (
            room_id INT NOT NULL,
            facility_id INT NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
            FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
            PRIMARY KEY (room_id, facility_id)
        )
    `)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_id INT NOT NULL,
            order_date DATE NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            special_request TEXT,
            room_type ENUM('Single', 'Double', 'Suite') NOT NULL,
            status ENUM('checked-in', 'checked-out', 'in-progress') NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
    `)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date DATE NOT NULL,
            subject VARCHAR(255) NOT NULL,
            comment TEXT NOT NULL,
            archive BOOLEAN NOT NULL
        )
    `)
}


async function seedDatabase() {
    const connection = await connectDB()

    try {
        console.log('Conectado a MySQL')

        await createTables(connection)

        await seedUsers(connection)
        const insertedRoomIds = await seedRooms(connection)
        await seedBookings(connection, insertedRoomIds)
        await seedContacts(connection)

        console.log('Datos ficticios añadidos exitosamente')
    } catch (error) {
        console.error('Error al añadir datos', error)
    } finally {
        await connection.end()
    }
}

async function seedUsers(connection: mysql.Connection) {
    const users: UserInterface[] = []
    const saltRounds = 10
    const password = 'miContraseñaSegura'
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const johnDoe: UserInterface = {
        id: 1,
        username: 'johndoe',
        fullname: 'John Doe',
        password: hashedPassword,
        email: 'johndoe@example.com',
        photo: faker.image.avatar(),
        entry_date: new Date(),
        position_description: 'Manager',
        phone: '1234567890',
        state: 'active',
        position: 'manager',
    }

    await connection.query<ResultSetHeader>(
        'INSERT INTO users (username, fullname, password, email, photo, entry_date, position_description, phone, state, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            johnDoe.username,
            johnDoe.fullname,
            johnDoe.password,
            johnDoe.email,
            johnDoe.photo,
            johnDoe.entry_date,
            johnDoe.position_description,
            johnDoe.phone,
            johnDoe.state,
            johnDoe.position,
        ]
    )

    users.push(johnDoe)

    const insertedUserIds: number[] = []

    for (let i = 0; i < 10; i++) {
        const hashedUserPassword = await bcrypt.hash(faker.internet.password(), saltRounds)
        const number = faker.phone.number().split(' ')
        console.log(number)
        const newUser: UserInterface = {
            username: faker.internet.userName(),
            fullname: faker.person.fullName(),
            password: hashedUserPassword,
            email: faker.internet.email(),
            photo: faker.image.avatar(),
            entry_date: faker.date.past(),
            position_description: faker.lorem.sentence(),
            phone: number[0],
            state: faker.helpers.arrayElement(['active', 'inactive']),
            position: faker.helpers.arrayElement(['receptionist', 'manager', 'cleaner']),
        }

        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO users (username, fullname, password, email, photo, entry_date, position_description, phone, state, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                newUser.username,
                newUser.fullname,
                newUser.password,
                newUser.email,
                newUser.photo,
                newUser.entry_date,
                newUser.position_description,
                newUser.phone,
                newUser.state,
                newUser.position,
            ]
        )

        insertedUserIds.push(result.insertId)
    }

    console.log('IDs de usuarios insertados:', insertedUserIds)
    return insertedUserIds
}

async function seedRooms(connection: mysql.Connection) {
    const facilities = [
        { name: 'WiFi' },
        { name: 'TV' },
        { name: 'Minibar' },
        { name: 'Air Conditioning' },
        { name: 'Safe' },
    ]

    await connection.query('INSERT INTO facilities (facility_name) VALUES ?', [
        facilities.map(facility => [facility.name])
    ])

    const rooms: RoomInterface[] = []
    for (let i = 0; i < 10; i++) {
        const room = {
            photo: faker.image.url(),
            room_number: faker.number.int({ min: 100, max: 500 }),
            bed_type: faker.helpers.arrayElement(['Single', 'Double', 'Queen', 'King']),
            rate: faker.number.int({ min: 5000, max: 20000 }),
            offer_price: faker.number.int({ min: 0, max: 100 }),
            status: faker.helpers.arrayElement(['available', 'booked']),
        }
        rooms.push(room)
    }

    const [result] = await connection.query<mysql.ResultSetHeader>(
        'INSERT INTO rooms (photo, room_number, bed_type, rate, offer_price, status) VALUES ?',
        [rooms.map(room => [room.photo, room.room_number, room.bed_type, room.rate, room.offer_price, room.status])]
    )

    const firstRoomId = result.insertId

    const roomIds = Array.from({ length: rooms.length }, (_, index) => firstRoomId + index)

    const [facilitiesRows] = await connection.query('SELECT id FROM facilities')
    const facilityIds = facilitiesRows as { id: number }[]

    const roomFacilities: [number, number][] = []
    for (let i = 0; i < rooms.length; i++) {
        const randomFacilities = faker.helpers.arrayElements(facilityIds, 2)
        randomFacilities.forEach(facility => {
            roomFacilities.push([roomIds[i], facility.id])
        })
    }

    await connection.query('INSERT INTO room_facilities (room_id, facility_id) VALUES ?', [roomFacilities])
    return roomIds
}

async function seedBookings(connection: mysql.Connection, roomIds: number[]) {
    for (let i = 0; i < 10; i++) {
        const booking: BookingInterface = {
            room_id: faker.helpers.arrayElement(roomIds),
            order_date: faker.date.past(),
            check_in: faker.date.future(),
            check_out: faker.date.future(),
            special_request: faker.lorem.sentence(),
            room_type: faker.helpers.arrayElement(['Single', 'Double', 'Suite']),
            status: faker.helpers.arrayElement(['checked-in', 'checked-out', 'in-progress']),
        }

        await connection.query<ResultSetHeader>(
            'INSERT INTO bookings ( room_id, order_date, check_in, check_out, special_request, room_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [booking.room_id, booking.order_date, booking.check_in, booking.check_out, booking.special_request, booking.room_type, booking.status]
        )
    }
}

async function seedContacts(connection: mysql.Connection) {
    for (let i = 0; i < 5; i++) {
        const contact: ContactInterface = {
            date: new Date(),
            subject: faker.lorem.sentence(),
            comment: faker.lorem.paragraph(),
            archive: faker.datatype.boolean(),
        }

        await connection.query<ResultSetHeader>(
            'INSERT INTO contacts (date, subject, comment, archive) VALUES (?, ?, ?, ?)',
            [contact.date, contact.subject, contact.comment, contact.archive]
        )
    }
}

seedDatabase()