import CustomTourRequest from '../models/CustomTourRequest.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Create a custom tour request
 * @route   POST /api/custom-tours
 * @access  Private
 */
export const createRequest = asyncHandler(async (req, res) => {
  const {
    destinations,
    startDate,
    endDate,
    adults,
    children,
    budget,
    budgetType,
    accommodationType,
    transportation,
    meals,
    activities,
    pickupLocation,
    specialRequests,
    contactPhone,
    contactEmail,
  } = req.body;

  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    return sendError(res, 'End date must be after start date', 400);
  }

  if (new Date(startDate) < new Date()) {
    return sendError(res, 'Start date cannot be in the past', 400);
  }

  const tourRequest = await CustomTourRequest.create({
    user: req.user._id,
    destinations,
    startDate,
    endDate,
    adults,
    children: children || 0,
    budget,
    budgetType: budgetType || 'per_person',
    accommodationType: accommodationType || 'standard',
    transportation: transportation || 'car',
    meals: meals || 'breakfast',
    activities: activities || [],
    pickupLocation: pickupLocation || '',
    specialRequests: specialRequests || '',
    contactPhone,
    contactEmail,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'custom_tour_requested',
    description: `User ${req.user.name} requested a custom tour to ${destinations.join(', ')}`,
    relatedId: tourRequest._id,
    relatedModel: 'CustomTourRequest',
    metadata: { budget, travelers: adults + (children || 0) },
  });

  // Notify admins
  const admins = await User.find({ role: 'admin' });
  await Promise.all(
    admins.map((admin) =>
      Notification.create({
        recipient: admin._id,
        type: 'tour_request_updated',
        title: 'New Custom Tour Request',
        message: `New tour request from ${req.user.name} for ${destinations.join(', ')}`,
        relatedId: tourRequest._id,
        relatedModel: 'CustomTourRequest',
      })
    )
  );

  sendSuccess(res, { request: tourRequest }, 'Tour request submitted successfully', 201);
});

/**
 * @desc    Get user's custom tour requests
 * @route   GET /api/custom-tours/my
 * @access  Private
 */
export const getMyRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const requests = await CustomTourRequest.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await CustomTourRequest.countDocuments(filter);

  sendPaginated(res, requests, total, page, limit, 'Tour requests fetched successfully');
});

/**
 * @desc    Get single custom tour request
 * @route   GET /api/custom-tours/:id
 * @access  Private
 */
export const getRequest = asyncHandler(async (req, res) => {
  const request = await CustomTourRequest.findById(req.params.id).populate('user', 'name email phone profileImage');

  if (!request) {
    return sendError(res, 'Request not found', 404);
  }

  // Check ownership or admin
  if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized', 403);
  }

  sendSuccess(res, { request }, 'Request fetched successfully');
});

/**
 * @desc    Get all custom tour requests (Admin)
 * @route   GET /api/custom-tours
 * @access  Private/Admin
 */
export const getAllRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const requests = await CustomTourRequest.find(filter)
    .populate('user', 'name email phone profileImage')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await CustomTourRequest.countDocuments(filter);

  sendPaginated(res, requests, total, page, limit, 'Tour requests fetched successfully');
});

/**
 * @desc    Update custom tour request status (Admin)
 * @route   PUT /api/custom-tours/:id/status
 * @access  Private/Admin
 */
export const updateStatus = asyncHandler(async (req, res) => {
  const { status, quotedPrice, adminNotes } = req.body;

  const request = await CustomTourRequest.findById(req.params.id).populate('user');

  if (!request) {
    return sendError(res, 'Request not found', 404);
  }

  const validTransitions = {
    pending: ['under_review', 'approved', 'rejected'],
    under_review: ['approved', 'rejected'],
    approved: ['completed'],
    rejected: [],
    completed: [],
  };

  if (!validTransitions[request.status].includes(status)) {
    return sendError(res, `Cannot change status from ${request.status} to ${status}`, 400);
  }

  request.status = status;
  if (quotedPrice !== undefined) {
    request.quotedPrice = quotedPrice;
  }
  if (adminNotes !== undefined) {
    request.adminNotes = adminNotes;
  }
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();
  await request.save();

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'custom_tour_updated',
    description: `Admin updated tour request ${request.requestId} to ${status}`,
    relatedId: request._id,
    relatedModel: 'CustomTourRequest',
    metadata: { status, quotedPrice },
  });

  // Notify user
  await Notification.create({
    recipient: request.user._id,
    type: 'tour_request_updated',
    title: 'Tour Request Update',
    message: `Your tour request ${request.requestId} has been ${status}.`,
    relatedId: request._id,
    relatedModel: 'CustomTourRequest',
  });

  sendSuccess(res, { request }, 'Status updated successfully');
});

/**
 * @desc    Cancel custom tour request (User)
 * @route   PUT /api/custom-tours/:id/cancel
 * @access  Private
 */
export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await CustomTourRequest.findById(req.params.id);

  if (!request) {
    return sendError(res, 'Request not found', 404);
  }

  // Check ownership
  if (request.user.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  if (!['pending', 'under_review'].includes(request.status)) {
    return sendError(res, 'Cannot cancel this request', 400);
  }

  request.status = 'rejected';
  request.adminNotes = 'Cancelled by user';
  await request.save();

  sendSuccess(res, { request }, 'Request cancelled successfully');
});

/**
 * @desc    Delete custom tour request
 * @route   DELETE /api/custom-tours/:id
 * @access  Private/Admin
 */
export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await CustomTourRequest.findById(req.params.id);

  if (!request) {
    return sendError(res, 'Request not found', 404);
  }

  await request.deleteOne();

  sendSuccess(res, null, 'Request deleted successfully');
});

/**
 * @desc    Get custom tour request stats (Admin)
 * @route   GET /api/custom-tours/stats
 * @access  Private/Admin
 */
export const getStats = asyncHandler(async (req, res) => {
  const [total, pending, underReview, approved, rejected, completed] = await Promise.all([
    CustomTourRequest.countDocuments(),
    CustomTourRequest.countDocuments({ status: 'pending' }),
    CustomTourRequest.countDocuments({ status: 'under_review' }),
    CustomTourRequest.countDocuments({ status: 'approved' }),
    CustomTourRequest.countDocuments({ status: 'rejected' }),
    CustomTourRequest.countDocuments({ status: 'completed' }),
  ]);

  const totalBudget = await CustomTourRequest.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: null, total: { $sum: '$budget' } } },
  ]);

  sendSuccess(
    res,
    {
      stats: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        completed,
        totalBudget: totalBudget[0]?.total || 0,
      },
    },
    'Stats fetched successfully'
  );
});
