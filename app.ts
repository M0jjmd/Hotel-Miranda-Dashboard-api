import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/apiRoutes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', userRoutes)

app.get('/', (req, res) => {
    res.send('API is running...')
})

export default app