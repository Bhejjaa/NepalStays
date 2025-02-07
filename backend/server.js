const dotenv = require('dotenv');

// Load env vars first
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

// Connect to the database
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });