import express from 'express';
import {
  getActivities,
  getRecentActivities,
  getActivityStats,
  deleteOldActivities,
  getActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getActivityStats);
router.get('/recent', getRecentActivities);
router.delete('/old', deleteOldActivities);
router.get('/:id', getActivity);
router.get('/', getActivities);

export default router;
