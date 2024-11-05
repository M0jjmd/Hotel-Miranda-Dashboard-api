import dotenv from "dotenv"
import mongoose from 'mongoose'

dotenv.config()

const url = process.env.SERVER_URL
console.log(url + "console log de la conexion db");

const connectDB = async () => {
    if (!url) {
        console.error('Server URL is not defined')
        return
    }
    try {
        await mongoose.connect(url)
        console.log('MongoDB Connected')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

export default connectDB