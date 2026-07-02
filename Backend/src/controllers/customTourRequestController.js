import CustomTourRequest from '../models/CustomTourRequest.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import emailService from '../utils/emailService.js';

export const createRequest = asyncHandler(async (req, res) => {
  const { destinations, startDate, endDate, adults, children, budget, budgetType,
    accommodationType, transportation, meals, activities, pickupLocation,
    specialRequests, contactPhone, contactEmail } = req.body;

  if (new Date(startDate) >= new Date(endDate)) return sendError(res, 'End date must be after start date', 400);

  const tourRequest = await CustomTourRequest.create({
    user: req.user._id, destinations, startDate, endDate, adults,
    children: children || 0, budget, budgetType: budgetType || 'per_person',
    accommodationType: accommodationType || 'standard', transportation: transportation || 'car',
    meals: meals || 'breakfast', activities: activities || [],
    pickupLocation: pickupLocation || '', specialRequests: specialRequests || '',
    contactPhone, contactEmail,
  });

  await Activity.create({
    user: req.user._id, type: 'custom_tour_requested',
    description: `User ${req.user.name} requested custom tour to ${destinations.join(', ')}`,
    relatedId: tourRequest._id, relatedModel: 'CustomTourRequest',
    metadata: { budget, travelers: adults + (children || 0) },
  }).catch(() => {});

  const admins = await User.find({ role: 'admin' });
  await Promise.all(admins.map((admin) =>
    Notification.create({
      recipient: admin._id, type: 'tour_request_updated',
      title: 'New Custom Tour Request',
      message: `New tour request from ${req.user.name} for ${destinations.join(', ')}`,
      relatedId: tourRequest._id, relatedModel: 'CustomTourRequest',
    }).catch(() => {})
  ));

  // Send confirmation email to user
  const emailAddr = contactEmail || req.user.email;
  if (emailAddr) {
    emailService.sendCustomTourSubmitted(emailAddr, {
      ...tourRequest.toObject(),
      contactName: req.user.name,
    });
  }

  sendSuccess(res, { request: tourRequest }, 'Tour request submitted successfully', 201);
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [requests, total] = await Promise.all([
    CustomTourRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    CustomTourRequest.countDocuments(filter),
  ]);
  sendPaginated(res, requests, total, page, limit, 'Your tour requests fetched successfully');
});

export const getAllRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.$or = [
    { destinations: new RegExp(req.query.search, 'i') },
    { contactEmail: new RegExp(req.query.search, 'i') },
  ];

  const [requests, total] = await Promise.all([
    CustomTourRequest.find(filter)
      .populate('user', 'name email phone profileImage')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 }).skip(skip).limit(limit),
    CustomTourRequest.countDocuments(filter),
  ]);
  sendPaginated(res, requests, total, page, limit, 'Tour requests fetched successfully');
});

export const getRequest = asyncHandler(async (req, res) => {
  const request = await CustomTourRequest.findById(req.params.id)
    .populate('user', 'name email phone profileImage')
    .populate('reviewedBy', 'name email');
  if (!request) return sendError(res, 'Tour request not found', 404);

  if (req.user.role !== 'admin' && String(request.user._id) !== String(req.user._id)) {
    return sendError(res, 'Not authorized', 403);
  }
  sendSuccess(res, { request }, 'Tour request fetched successfully');
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, quotedPrice } = req.body;
  const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'completed'];
  if (!validStatuses.includes(status)) return sendError(res, 'Invalid status', 400);

  const request = await CustomTourRequest.findById(req.params.id).populate('user', 'name email');
  if (!request) return sendError(res, 'Tour request not found', 404);

  request.status = status;
  if (adminNotes) request.adminNotes = adminNotes;
  if (quotedPrice) request.quotedPrice = quotedPrice;
  request.reviewedBy = req.user._id;
  await request.save();

  await Activity.create({
    user: req.user._id, type: 'custom_tour_updated',
    description: `Custom tour request ${request.requestId} status updated to ${status}`,
    relatedId: request._id, relatedModel: 'CustomTourRequest',
    metadata: { status, quotedPrice },
  }).catch(() => {});

  if (request.user?._id) {
    await Notification.create({
      recipient: request.user._id, type: 'tour_request_updated',
      title: 'Custom Tour Update',
      message: `Your tour request (${request.requestId}) has been ${status}.${quotedPrice ? ` Quoted price: ₹${quotedPrice.toLocaleString('en-IN')}` : ''}`,
      relatedId: request._id, relatedModel: 'CustomTourRequest',
    }).catch(() => {});
  }

  sendSuccess(res, { request }, 'Tour request updated successfully');
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await CustomTourRequest.findById(req.params.id);
  if (!request) return sendError(res, 'Tour request not found', 404);
  if (String(request.user) !== String(req.user._id) && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized', 403);
  }
  if (request.status === 'completed') return sendError(res, 'Cannot cancel completed request', 400);
  request.status = 'rejected';
  await request.save();
  sendSuccess(res, { request }, 'Tour request cancelled successfully');
});

export const getStats = asyncHandler(async (req, res) => {
  const [total, pending, underReview, approved, rejected, completed] = await Promise.all([
    CustomTourRequest.countDocuments(),
    CustomTourRequest.countDocuments({ status: 'pending' }),
    CustomTourRequest.countDocuments({ status: 'under_review' }),
    CustomTourRequest.countDocuments({ status: 'approved' }),
    CustomTourRequest.countDocuments({ status: 'rejected' }),
    CustomTourRequest.countDocuments({ status: 'completed' }),
  ]);
  sendSuccess(res, { stats: { total, pending, underReview, approved, rejected, completed } }, 'Stats fetched');
});
