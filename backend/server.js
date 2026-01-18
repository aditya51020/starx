import 'dotenv/config';
import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import sequelize from './config/database.js'; // Import Sequelize

import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Parse ALLOWED_ORIGINS from env if it exists
const ENV_ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const ALLOWED_ORIGINS = [
  CLIENT_URL,
  "https://starx-nu.vercel.app",
  "http://localhost:5174",
  ...ENV_ALLOWED_ORIGINS
];

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading resources from other origins if needed
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter); // Apply rate limiting to API routes

// Logging
app.use(morgan('dev'));



// Pre-flight Options
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      return res.sendStatus(200);
    }
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Database Sync
sequelize.sync({ force: false }) // Set force: true to drop tables on restart
  .then(() => console.log('SQLite Database connected and synced'))
  .catch(err => console.error('Database sync error:', err));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
