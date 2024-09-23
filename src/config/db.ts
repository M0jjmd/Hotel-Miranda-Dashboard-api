import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const url = process.env.SERVER_URL

const connectDB = async () => {
    if (!url) {
        throw new Error('server is not defined')
    }
    try {
        await mongoose.connect(url)
        console.log('MongoDB Connected')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    }
}

export default connectDB