// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
  });

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
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/colleges', require('./routes/college.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/articles', require('./routes/article.routes'));
app.use('/api/ask', require('./routes/ask.routes'));
app.use('/api/verification', require('./routes/verification.routes'));
app.use('/api/predictor', require('./routes/predictor.routes'));


require('./automation/nirfIngestion').initCron();
require('./cron/examCron')();



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
