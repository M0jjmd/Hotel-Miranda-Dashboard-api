import express from 'express'
import userRoutes from './routes/apiRoutes'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api', userRoutes)

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global Error:', err)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    })
})

export default app
