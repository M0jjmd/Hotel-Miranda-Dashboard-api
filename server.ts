import app from './app'
import connectDB from './src/config/db'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err)
        process.exit(1)
    })
