import { Router } from 'express';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

const router = Router();

// Admin: get all users
router.get(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    sendPaginated(res, users, total, page, limit, 'Users fetched successfully');
  })
);

// Admin: get single user
router.get(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, { user }, 'User fetched');
  })
);

// Admin: toggle user active status
router.put(
  '/:id/toggle-status',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot deactivate admin accounts', 403);
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    sendSuccess(res, { user }, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`);
  })
);

// Admin: delete user
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot delete admin accounts', 403);
    await User.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, 'User deleted successfully');
  })
);

export default router;
