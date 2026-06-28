import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import sequelize from './config/database.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins (Vercel + local)
import { corsOptions, ALLOWED_ORIGINS } from './config/corsConfig.js';

console.log('Allowed Origins:', ALLOWED_ORIGINS);

// CORS
app.use(cors(corsOptions));

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

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// Body & Cookie parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes); // Auth routes first
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/api/test-deploy', (req, res) => {
  res.json({ message: "Deployment v2 active", time: new Date().toISOString() });
});

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
sequelize.sync({ alter: true })
  .then(() => console.log('SQLite Database connected and synced'))
  .catch(err => console.error('Database sync error:', err));

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;