// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().catch(err => console.log('MongoDB connection failed'));

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(express.json());

// ✅ ALLOWED ORIGINS (IMPORTANT)
const allowedOrigins = [
  'https://collegedost.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

// ✅ CORRECT CORS CONFIG (NO origin:true)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests without origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed'), false);
    }
  },
  credentials: false, // ✅ JWT header based auth (stable)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// =======================
// ROOT ROUTE
// =======================
app.get('/', (req, res) => {
  res.send('CollegeDost API is running...');
});

// =======================
// ROUTES
// =======================
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/colleges', require('./routes/college.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/articles', require('./routes/article.routes'));
app.use('/api/ask', require('./routes/ask.routes'));
app.use('/api/verification', require('./routes/verification.routes'));
app.use('/api/predictor', require('./routes/predictor.routes'));

// =======================
// NIRF CRON JOB
// =======================
require('./automation/nirfIngestion').initCron();

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
