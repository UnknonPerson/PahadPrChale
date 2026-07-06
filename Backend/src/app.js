import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import customTourRequestRoutes from './routes/customTourRequestRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

const app = express();
app.set('trust proxy', 1);

// ─── Security ─────────────────────────────────────────────────────────────────

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // handled by frontend
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  // Add production domains here
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/custom-tours', customTourRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_, res) =>
  res.json({
    success: true,
    message: 'PahadPerChale API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PahadPrChale Backend API is running 🚀"
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

export default app;
