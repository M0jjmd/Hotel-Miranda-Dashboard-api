import dotenv from "dotenv"
import app from './app'
import connectDB from './config/db'
import serverless from 'serverless-http'

dotenv.config()

connectDB()
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err)
        process.exit(1)
    })

export const handler = serverless(app)
