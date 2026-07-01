import express from 'express';
import {
  createRequest,
  getMyRequests,
  getRequest,
  getAllRequests,
  updateStatus,
  cancelRequest,
  deleteRequest,
  getStats,
} from '../controllers/customTourRequestController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createRequest);
router.get('/my', getMyRequests);
router.put('/:id/cancel', cancelRequest);

// Admin routes
router.get('/stats', adminOnly, getStats);
router.get('/', adminOnly, getAllRequests);
router.put('/:id/status', adminOnly, updateStatus);
router.delete('/:id', adminOnly, deleteRequest);

// Shared routes (ownership checked in controller)
router.get('/:id', getRequest);

export default router;
