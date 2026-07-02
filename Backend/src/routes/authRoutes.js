import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  upload,
  handleSingleUpload,
} from '../middleware/cloudinaryUpload.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

// Email verification
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerificationEmail);

// Password reset
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected
router.get('/me', protect, getMe);
router.put(
  '/update-profile',
  protect,
  upload.single('profileImage'),
  handleSingleUpload('users'),
  updateProfile
);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

// Aliases used by frontend authService
router.put(
  '/users/profile',
  protect,
  upload.single('profileImage'),
  handleSingleUpload('users'),
  updateProfile
);
router.put('/users/password', protect, changePassword);
router.delete('/users/account', protect, deleteAccount);

export default router;
