import express from 'express';
import {
  createMessage, getMyMessages, getMessage, getAllMessages,
  markAsRead, replyToMessage, deleteMessage, getUnreadCount,
} from '../controllers/messageController.js';
import { protect, requireVerifiedEmail } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect);

// Sending a message requires verified email
router.post('/', requireVerifiedEmail, createMessage);
router.get('/my', getMyMessages);
router.get('/unread-count', adminOnly, getUnreadCount);
router.get('/:id', getMessage);
router.delete('/:id', deleteMessage);

// Admin routes
router.get('/', adminOnly, getAllMessages);
router.put('/:id/read', adminOnly, markAsRead);
router.post('/:id/reply', adminOnly, replyToMessage);

export default router;
