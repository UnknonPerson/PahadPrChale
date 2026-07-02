import express from 'express';
import {
  createRequest, getMyRequests, getRequest, getAllRequests,
  updateRequestStatus, cancelRequest, getStats,
} from '../controllers/customTourRequestController.js';
import { protect, requireVerifiedEmail } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect);

// Creating a custom tour requires verified email
router.post('/', requireVerifiedEmail, createRequest);
router.get('/my', getMyRequests);
router.put('/:id/cancel', cancelRequest);

router.get('/stats', adminOnly, getStats);
router.get('/', adminOnly, getAllRequests);
router.put('/:id/status', adminOnly, updateRequestStatus);
router.get('/:id', getRequest);

export default router;
