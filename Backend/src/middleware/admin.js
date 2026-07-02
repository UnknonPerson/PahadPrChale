import { sendError } from '../utils/response.js';

/**
 * Require admin role. Must be chained AFTER protect middleware.
 * protect already fetches the user — no extra DB call needed.
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Admin access required', 403);
  }
  next();
};
