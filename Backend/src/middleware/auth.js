import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/response.js';

/**
 * Protect routes - Verify JWT token only. Does NOT check email verification.
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies?.token) token = req.cookies.token;
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return sendError(res, 'Not authorized to access this route', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 'User not found', 401);
    if (!user.isActive) return sendError(res, 'Account deactivated', 403);

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized to access this route', 401);
  }
};

/**
 * Optional auth - Attach user if token present, never blocks.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.cookies?.token) token = req.cookies.token;
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch { /* ignore */ }
  next();
};

/**
 * Require verified email - Use ONLY on sensitive action routes.
 * Always chain AFTER protect: router.post('/book', protect, requireVerifiedEmail, handler)
 */
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) return sendError(res, 'Not authorized', 401);
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to perform this action.',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
  next();
};
