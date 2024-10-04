import app from './app'
import connectDB from './src/config/db'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const port = process.env.PORT || 8080

app.use(cors())

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