import express from 'express';
import {
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  rejectTestimonial,
  toggleFeature,
  getFeaturedTestimonials,
} from '../controllers/testimonialController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedTestimonials);
router.get('/', optionalAuth, getAllTestimonials);
router.get('/:id', getTestimonial);

// Protected routes
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

// Admin routes
router.put('/:id/approve', protect, adminOnly, approveTestimonial);
router.put('/:id/reject', protect, adminOnly, rejectTestimonial);
router.put('/:id/feature', protect, adminOnly, toggleFeature);

export default router;
