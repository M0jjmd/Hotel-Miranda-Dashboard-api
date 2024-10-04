import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/apiRoutes'
import connectDB from './src/config/db'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const initializeRoutes = async () => {
    const connection = await connectDB()
    app.use('/api', userRoutes(connection))
}

initializeRoutes().catch((err) => {
    console.error('Error initializing routes:', err)
    process.exit(1)
})


app.get('/', (req, res) => {
    res.send('API is running...')
})

export default app