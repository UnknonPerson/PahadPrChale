import express from 'express';
import {
  getAllHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByDestination,
} from '../controllers/hotelController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/destination/:destinationId', getHotelsByDestination);
router.get('/', getAllHotels);
router.get('/:id', getHotel);

// Admin protected routes
router.post('/', protect, adminOnly, createHotel);
router.put('/:id', protect, adminOnly, updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

export default router;
