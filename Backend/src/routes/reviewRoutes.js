import express from 'express';
import {
  createReview, getPackageReviews, getMyReviews, getAllReviews,
  getReviewStats, updateReviewStatus, deleteReview, canReviewBooking,
} from '../controllers/reviewController.js';
import { protect, requireVerifiedEmail } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/stats', getReviewStats);
router.get('/package/:packageId', getPackageReviews);

// Protected routes
router.use(protect);

// Posting a review requires verified email
router.post('/', requireVerifiedEmail, createReview);
router.get('/my', getMyReviews);
router.get('/can-review/:bookingId', canReviewBooking);
router.delete('/:id', deleteReview);

// Admin routes
router.get('/', adminOnly, getAllReviews);
router.put('/:id/status', adminOnly, updateReviewStatus);

export default router;
