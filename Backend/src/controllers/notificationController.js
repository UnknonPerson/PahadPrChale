import Notification from '../models/Notification.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * @desc    Get user's notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const unreadOnly = req.query.unread === 'true';

  const filter = { recipient: req.user._id };
  if (unreadOnly) {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  sendSuccess(
    res,
    {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    },
    'Notifications fetched successfully'
  );
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  sendSuccess(res, { count }, 'Unread count fetched successfully');
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    return sendError(res, 'Notification not found', 404);
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  sendSuccess(res, { notification }, 'Notification marked as read');
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  sendSuccess(res, null, 'All notifications marked as read');
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    return sendError(res, 'Notification not found', 404);
  }

  await notification.deleteOne();

  sendSuccess(res, null, 'Notification deleted successfully');
});

/**
 * @desc    Delete all read notifications
 * @route   DELETE /api/notifications/read
 * @access  Private
 */
export const deleteReadNotifications = asyncHandler(async (req, res) => {
  const result = await Notification.deleteMany({
    recipient: req.user._id,
    isRead: true,
  });

  sendSuccess(res, { deletedCount: result.deletedCount }, 'Read notifications deleted successfully');
});
