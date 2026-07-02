import { Router } from 'express';
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
import {
  upload,
  uploadMultiple,
  handleSingleUpload,
  handleMultipleUploads,
} from '../middleware/cloudinaryUpload.js';

const router = Router();

router.get('/featured', getFeaturedPackages);
router.get('/search', searchPackages);
router.get('/', optionalAuth, getAllPackages);
router.get('/:id', getPackage);

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  handleSingleUpload('packages'),
  createPackage
);
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.single('image'),
  handleSingleUpload('packages'),
  updatePackage
);
router.delete('/:id', protect, adminOnly, deletePackage);

export default router;
