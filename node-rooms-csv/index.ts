import express from 'express'
import { RoomService } from './services/roomService'

const app = express()
const port = 3000

app.use(express.json())

const roomService = new RoomService()

app.get('/rooms', (req, res) => {
    res.json(roomService.getAll())
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})