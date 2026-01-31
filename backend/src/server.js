// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB with retry logic
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.error('Server will continue but DB operations will fail');
  }
};

const app = express();


app.use(express.json());


const allowedOrigins = [
  'https://collegedost.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check against static allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check for Vercel Preview Deployments (Dynamic)
      // Matches https://<project>-<hash>-<user>.vercel.app
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      console.warn(`🚫 CORS blocked for origin: ${origin}`);
      return callback(null, false);
    },
    credentials: false, // JWT-based auth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);


app.get('/', (req, res) => {
  res.send('CollegeDost API is running...');
});


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/admin/ingest', require('./routes/admin.ingestion.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/colleges', require('./routes/college.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/articles', require('./routes/article.routes'));
app.use('/api/ask', require('./routes/ask.routes'));
app.use('/api/verification', require('./routes/verification.routes'));
app.use('/api/predictor', require('./routes/predictor.routes'));
app.use('/api/test-prep', require('./routes/testPrep.routes'));

// Global error handler - prevents unhandled errors from crashing the server
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Initialize cron jobs
try {
  require('./cron/scheduler').init();
  require('./cron/examCron')();
} catch (cronError) {
  console.error('Cron initialization error:', cronError.message);
}

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

// Start the server
startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
