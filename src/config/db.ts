import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME

const connectDB = async () => {
    if (!host || !user || !password || !database) {
        throw new Error('Database configuration is not defined in environment variables')
    }

    try {
        const tempConnection = await mysql.createConnection({
            host,
            user,
            password,
        })

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${database}`)
        await tempConnection.end()

        const connection = await mysql.createConnection({
            host,
            user,
            password,
            database,
        })
        console.log('MySQL Connected')
        return connection
    } catch (error) {
        console.error('Error connecting to MySQL:', error)
        process.exit(1)
    }
}

export default connectDB