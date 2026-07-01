import express from 'express';
import {
  createMessage,
  getMyMessages,
  getMessage,
  getAllMessages,
  markAsRead,
  replyToMessage,
  deleteMessage,
  getUnreadCount,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createMessage);
router.get('/my', getMyMessages);
router.get('/unread-count', adminOnly, getUnreadCount);
router.get('/:id', getMessage);
router.delete('/:id', deleteMessage);

// Admin routes
router.get('/', adminOnly, getAllMessages);
router.put('/:id/read', adminOnly, markAsRead);
router.post('/:id/reply', adminOnly, replyToMessage);

export default router;
