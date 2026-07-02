import express from 'express';
import {
  createBooking, getAllBookings, getBooking, updateBookingStatus,
  deleteBooking, cancelBooking, getMyBookings, getBookingStats,
} from '../controllers/bookingController.js';
import { protect, optionalAuth, requireVerifiedEmail } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Creating a booking requires auth + verified email
router.post('/', protect, requireVerifiedEmail, createBooking);

// User routes
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/stats', protect, adminOnly, getBookingStats);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);

export default router;
