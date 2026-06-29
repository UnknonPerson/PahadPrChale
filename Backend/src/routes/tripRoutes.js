import express from 'express';
import {
  createTrip,
  getMyTrips,
  getTrip,
  updateTrip,
  cancelTrip,
  deleteTrip,
  getAllTrips,
  updateTripStatus,
  getTripStats,
} from '../controllers/tripController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', protect, adminOnly, getAllTrips);
router.get('/admin/stats', protect, adminOnly, getTripStats);
router.put('/admin/:id', protect, adminOnly, updateTripStatus);

// User routes
router.post('/', protect, createTrip);
router.get('/my', protect, getMyTrips);
router.get('/:id', protect, getTrip);
router.put('/:id', protect, updateTrip);
router.put('/:id/cancel', protect, cancelTrip);
router.delete('/:id', protect, deleteTrip);

export default router;
