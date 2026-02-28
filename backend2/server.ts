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
const allowedOrigins = [
    'https://collegedost.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.client_uri
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true
}));

// Mount routers
import auth from './src/routes/auth.routes';
import users from './src/routes/user.routes';
import admin from './src/routes/admin.routes';
import colleges from './src/routes/college.routes';
import predictor from './src/routes/predictor.routes';
import reviews from './src/routes/review.routes';
import articles from './src/routes/article.routes';
import exams from './src/routes/exam.routes';
import courses from './src/routes/course.routes';
import search from './src/routes/search.routes';

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/admin', admin);
app.use('/api/colleges', colleges);
app.use('/api/search', search);
app.use('/api/predictor', predictor);
app.use('/api/reviews', reviews);
app.use('/api/articles', articles);
app.use('/api/exams', exams);
app.use('/api/courses', courses);

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
