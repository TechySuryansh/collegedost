const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database (Optional: if DB is down, we use file-based fallback for predictor)
// connectDB();
const startDB = async () => {
    try {
        await connectDB();
    } catch (e) {
        console.log("MongoDB connection failed, running in Offline Mode (File-based)");
    }
}
// startDB(); // Commented out to force file-mode stability if user has no DB
// Or better, let's just accept that we aren't using DB for this feature.
// But to be safe if user fixes DB later:
connectDB().catch(err => console.log("DB Failed")); // Port changed to 5001

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {

    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (whitelist.indexOf(origin) !== -1 || origin.startsWith('http://localhost:') || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log("CORS Blocked:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
const predictorRoutes = require('./routes/predictor.routes');
const authRoutes = require('./routes/auth.routes');

// Mount Routes
app.use('/api/predictor', predictorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/colleges', require('./routes/college.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/articles', require('./routes/article.routes'));
app.use('/api/ask', require('./routes/ask.routes'));
app.use('/api/verification', require('./routes/verification.routes'));

const PORT = process.env.PORT || 5000;

// Initialize NIRF Cron Job
require('./automation/nirfIngestion').initCron();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
