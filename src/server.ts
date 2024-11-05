import dotenv from "dotenv";
import app from './app';
import connectDB from './config/db';

dotenv.config();

connectDB()
    .then(() => {
        if (process.env.NODE_ENV !== 'lambda') {
            const port = process.env.PORT || 8080
            app.listen(port, () => {
                console.log(`Server running at http://localhost:${port}`);
            });
        } else {
            console.log('Lambda function initialized');
        }
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
