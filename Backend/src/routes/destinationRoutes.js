import express from 'express';
import {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  hardDeleteDestination,
  getStates,
  getFeaturedDestinations,
} from '../controllers/destinationController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/states', getStates);
router.get('/featured', getFeaturedDestinations);
router.get('/', optionalAuth, getAllDestinations);
router.get('/:id', getDestination);

// Admin protected routes
router.post('/', protect, adminOnly, createDestination);
router.put('/:id', protect, adminOnly, updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);
router.delete('/:id/permanent', protect, adminOnly, hardDeleteDestination);

export default router;
