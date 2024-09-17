import app from './app'
import connectDB from './src/config/db'

const port = 8000

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
