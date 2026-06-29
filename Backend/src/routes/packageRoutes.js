import express from 'express';
import {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getFeaturedPackages,
  searchPackages,
} from '../controllers/packageController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedPackages);
router.get('/search', searchPackages);
router.get('/', optionalAuth, getAllPackages);
router.get('/:id', getPackage);

// Admin protected routes
router.post('/', protect, adminOnly, createPackage);
router.put('/:id', protect, adminOnly, updatePackage);
router.delete('/:id', protect, adminOnly, deletePackage);

export default router;
