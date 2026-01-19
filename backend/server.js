import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import sequelize from './config/database.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins (Vercel + local)
const ALLOWED_ORIGINS = [
  "https://starxbuildtech.co.in",
  "https://www.starxbuildtech.co.in",
  "https://starx-nu.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Security
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting on API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Logging
app.use(morgan('dev'));

// Body & Cookie parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Simple health check route (testing ke liye)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend API is live!',
    uptime: process.uptime(),
  });
});

// No frontend serving - frontend is on Vercel
// If you have any leftover static middleware, remove it!

// Database sync
sequelize.sync({ force: false })
  .then(() => console.log('SQLite Database connected and synced'))
  .catch(err => console.error('Database sync error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;