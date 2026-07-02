import { Router } from 'express';
import {
  getAllDestinations, getDestination, createDestination, updateDestination,
  deleteDestination, permanentDeleteDestination, getStates, getFeaturedDestinations,
} from '../controllers/destinationController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { upload, uploadMultiple, handleSingleUpload, handleMultipleUploads } from '../middleware/cloudinaryUpload.js';

const router = Router();

router.get('/states', getStates);
router.get('/featured', getFeaturedDestinations);
router.get('/', optionalAuth, getAllDestinations);
router.get('/:id', getDestination);

router.post('/', protect, adminOnly, upload.single('image'), handleSingleUpload('destinations'), createDestination);
router.put('/:id', protect, adminOnly, upload.single('image'), handleSingleUpload('destinations'), updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);
router.delete('/:id/permanent', protect, adminOnly, permanentDeleteDestination);

export default router;
