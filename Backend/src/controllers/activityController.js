import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';

/**
 * @desc    Get all activities (Admin)
 * @route   GET /api/activities
 * @access  Private/Admin
 */
export const getActivities = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.type) {
    filter.type = req.query.type;
  }
  if (req.query.user) {
    filter.user = req.query.user;
  }

  const activities = await Activity.find(filter)
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Activity.countDocuments(filter);

  sendPaginated(res, activities, total, page, limit, 'Activities fetched successfully');
});

/**
 * @desc    Get recent activities (Admin)
 * @route   GET /api/activities/recent
 * @access  Private/Admin
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const activities = await Activity.find()
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit);

  sendSuccess(res, { activities }, 'Recent activities fetched successfully');
});

/**
 * @desc    Get activity stats (Admin)
 * @route   GET /api/activities/stats
 * @access  Private/Admin
 */
export const getActivityStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalAllTime, last30Days, last7Days, todayCount, byType] = await Promise.all([
    Activity.countDocuments(),
    Activity.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Activity.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Activity.countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    }),
    Activity.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  sendSuccess(
    res,
    {
      stats: {
        totalAllTime,
        last30Days,
        last7Days,
        today: todayCount,
        byType: byType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    },
    'Activity stats fetched successfully'
  );
});

/**
 * @desc    Delete old activities (Admin)
 * @route   DELETE /api/activities/old
 * @access  Private/Admin
 */
export const deleteOldActivities = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 90;
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const result = await Activity.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  sendSuccess(res, { deletedCount: result.deletedCount }, `${result.deletedCount} old activities deleted`);
});

/**
 * @desc    Get single activity
 * @route   GET /api/activities/:id
 * @access  Private/Admin
 */
export const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate('user', 'name email role');

  if (!activity) {
    return sendError(res, 'Activity not found', 404);
  }

  sendSuccess(res, { activity }, 'Activity fetched successfully');
});
