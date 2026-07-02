import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import emailService from '../utils/emailService.js';

export const createMessage = asyncHandler(async (req, res) => {
  const { subject, message, priority } = req.body;
  if (!subject?.trim() || !message?.trim()) return sendError(res, 'Subject and message are required', 400);

  const newMessage = await Message.create({
    user: req.user._id, subject, message, priority: priority || 'normal',
  });

  await Activity.create({
    user: req.user._id, type: 'message_sent',
    description: `${req.user.name} sent a message: "${subject}"`,
    relatedId: newMessage._id, relatedModel: 'Message',
  }).catch(() => {});

  const admins = await User.find({ role: 'admin' });
  await Promise.all(admins.map((admin) =>
    Notification.create({
      recipient: admin._id, type: 'message_received',
      title: 'New Support Message',
      message: `New message from ${req.user.name}: "${subject}"`,
      relatedId: newMessage._id, relatedModel: 'Message',
    }).catch(() => {})
  ));

  sendSuccess(res, { message: newMessage }, 'Message sent successfully', 201);
});

export const getMyMessages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const messages = await Message.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Message.countDocuments({ user: req.user._id });
  sendPaginated(res, messages, total, page, limit, 'Messages fetched successfully');
});

export const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id).populate('user', 'name email phone');
  if (!message) return sendError(res, 'Message not found', 404);
  if (message.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized', 403);
  }
  sendSuccess(res, { message }, 'Message fetched successfully');
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { subject: new RegExp(req.query.search, 'i') },
    ];
  }

  const messages = await Message.find(filter)
    .populate('user', 'name email phone profileImage')
    .populate('repliedBy', 'name email')
    .sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Message.countDocuments(filter);
  sendPaginated(res, messages, total, page, limit, 'Messages fetched successfully');
});

export const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return sendError(res, 'Message not found', 404);
  message.status = 'read';
  await message.save();
  sendSuccess(res, { message }, 'Message marked as read');
});

export const replyToMessage = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  if (!reply?.trim()) return sendError(res, 'Reply cannot be empty', 400);

  const message = await Message.findById(req.params.id).populate('user', 'name email');
  if (!message) return sendError(res, 'Message not found', 404);

  message.reply = reply;
  message.status = 'replied';
  message.repliedAt = new Date();
  message.repliedBy = req.user._id;
  await message.save();

  // Send email to user
  if (message.user?.email) {
    emailService.sendAdminMessage(message.user.email, message.user, message.subject, reply);
  }

  await Activity.create({
    user: req.user._id, type: 'message_replied',
    description: `Replied to message from ${message.user?.name}: "${message.subject}"`,
    relatedId: message._id, relatedModel: 'Message',
  }).catch(() => {});

  await Notification.create({
    recipient: message.user._id, type: 'message_replied',
    title: 'Reply from Support',
    message: `Your message "${message.subject}" has been replied to.`,
    relatedId: message._id, relatedModel: 'Message',
  }).catch(() => {});

  sendSuccess(res, { message }, 'Reply sent successfully');
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return sendError(res, 'Message not found', 404);
  if (message.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized', 403);
  }
  await message.deleteOne();
  sendSuccess(res, null, 'Message deleted successfully');
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({ status: 'unread' });
  sendSuccess(res, { count }, 'Unread count fetched successfully');
});
