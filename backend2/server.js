const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins for dev, can restrict in prod
    credentials: true
}));

// Mount routers
const auth = require('./src/routes/auth.routes');
const users = require('./src/routes/user.routes');
const admin = require('./src/routes/admin.routes');
// const colleges = require('./src/routes/college.routes'); // To be added later

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/admin', admin);

// Base route
app.get('/', (req, res) => {
    res.send('CollegeDost API v2 is running...');
});

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
