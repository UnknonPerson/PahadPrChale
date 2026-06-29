import Trip from '../models/Trip.js';
import Destination from '../models/Destination.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Create a new trip request
 * @route   POST /api/trips
 * @access  Private
 */
export const createTrip = asyncHandler(async (req, res) => {
  const {
    destinations,
    startDate,
    endDate,
    adults,
    children,
    hotelCategory,
    transportType,
    budget,
    specialRequirements,
  } = req.body;

  // Validate dates
  if (new Date(startDate) < new Date()) {
    return sendError(res, 'Start date cannot be in the past', 400);
  }

  if (new Date(endDate) < new Date(startDate)) {
    return sendError(res, 'End date must be after start date', 400);
  }

  // Validate destinations exist
  if (!destinations || destinations.length === 0) {
    return sendError(res, 'At least one destination is required', 400);
  }

  // Verify all destinations exist
  const destIds = destinations.map((d) => d.destination);
  const existingDests = await Destination.find({ _id: { $in: destIds } });

  if (existingDests.length !== destIds.length) {
    return sendError(res, 'One or more destinations not found', 404);
  }

  const trip = await Trip.create({
    user: req.user._id,
    destinations,
    startDate,
    endDate,
    adults,
    children: children || 0,
    hotelCategory: hotelCategory || 'Standard',
    transportType: transportType || 'Private',
    budget: budget || 0,
    specialRequirements: specialRequirements || '',
  });

  sendSuccess(res, { trip }, 'Trip request created successfully', 201);
});

/**
 * @desc    Get logged in user's trips
 * @route   GET /api/trips/my
 * @access  Private
 */
export const getMyTrips = asyncHandler(async (req, res) => {
  const { status, sort = '-createdAt' } = req.query;

  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  const trips = await Trip.find(query).sort(sort);

  sendSuccess(res, { trips }, 'Your trips fetched successfully');
});

/**
 * @desc    Get single trip
 * @route   GET /api/trips/:id
 * @access  Private
 */
export const getTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return sendError(res, 'Trip not found', 404);
  }

  // Check if user owns the trip or is admin
  if (trip.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized to access this trip', 403);
  }

  sendSuccess(res, { trip }, 'Trip fetched successfully');
});

/**
 * @desc    Update trip
 * @route   PUT /api/trips/:id
 * @access  Private
 */
export const updateTrip = asyncHandler(async (req, res) => {
  let trip = await Trip.findById(req.params.id);

  if (!trip) {
    return sendError(res, 'Trip not found', 404);
  }

  // Check ownership
  if (trip.user._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to update this trip', 403);
  }

  // Only allow updates if trip is pending
  if (trip.status !== 'Pending') {
    return sendError(res, 'Cannot update trip that is not pending', 400);
  }

  trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { trip }, 'Trip updated successfully');
});

/**
 * @desc    Cancel trip
 * @route   PUT /api/trips/:id/cancel
 * @access  Private
 */
export const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return sendError(res, 'Trip not found', 404);
  }

  // Check ownership
  if (trip.user._id.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized to cancel this trip', 403);
  }

  // Only allow cancellation if trip is pending or contacted
  if (!['Pending', 'Contacted'].includes(trip.status)) {
    return sendError(res, 'Cannot cancel this trip', 400);
  }

  trip.status = 'Cancelled';
  await trip.save();

  sendSuccess(res, { trip }, 'Trip cancelled successfully');
});

/**
 * @desc    Delete trip
 * @route   DELETE /api/trips/:id
 * @access  Private
 */
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return sendError(res, 'Trip not found', 404);
  }

  // Check ownership
  if (trip.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized to delete this trip', 403);
  }

  await trip.deleteOne();

  sendSuccess(res, null, 'Trip deleted successfully');
});

// ================== ADMIN ROUTES ==================

/**
 * @desc    Get all trips (Admin)
 * @route   GET /api/admin/trips
 * @access  Private (Admin only)
 */
export const getAllTrips = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sort = '-createdAt',
  } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const trips = await Trip.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Trip.countDocuments(query);

  sendPaginated(res, trips, total, page, limit, 'All trips fetched successfully');
});

/**
 * @desc    Update trip status (Admin)
 * @route   PUT /api/admin/trips/:id
 * @access  Private (Admin only)
 */
export const updateTripStatus = asyncHandler(async (req, res) => {
  const { status, totalAmount, notes } = req.body;

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return sendError(res, 'Trip not found', 404);
  }

  if (status) trip.status = status;
  if (totalAmount) trip.totalAmount = totalAmount;
  if (notes) trip.notes = notes;

  await trip.save();

  sendSuccess(res, { trip }, 'Trip status updated successfully');
});

/**
 * @desc    Get trip statistics (Admin)
 * @route   GET /api/admin/trips/stats
 * @access  Private (Admin only)
 */
export const getTripStats = asyncHandler(async (req, res) => {
  const stats = await Trip.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
  ]);

  const totalTrips = await Trip.countDocuments();

  sendSuccess(res, { stats, totalTrips }, 'Trip statistics fetched successfully');
});
