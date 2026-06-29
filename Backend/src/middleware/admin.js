import User from '../models/User.js';

/**
 * Restrict access to admin users only
 * Must be used after protect middleware
 */
export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};
