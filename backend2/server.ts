import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app: Application = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins for dev, can restrict in prod
    credentials: true
}));

// Mount routers
import auth from './src/routes/auth.routes';
import users from './src/routes/user.routes';
import admin from './src/routes/admin.routes';
// const colleges = require('./src/routes/college.routes'); // To be added later

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/admin', admin);

// Base route
app.get('/', (req: Request, res: Response) => {
    res.send('CollegeDost API v2 is running...');
});

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
process.on('unhandledRejection', (err: Error, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
