import Destination from '../models/Destination.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Get all destinations
 * @route   GET /api/destinations
 * @access  Public
 */
export const getAllDestinations = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    state,
    search,
    sort = '-createdAt',
  } = req.query;

  // Build query
  const query = { isActive: true };

  if (state) {
    query.state = state;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const destinations = await Destination.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Destination.countDocuments(query);

  sendPaginated(res, destinations, total, page, limit, 'Destinations fetched successfully');
});

/**
 * @desc    Get single destination
 * @route   GET /api/destinations/:id
 * @access  Public
 */
export const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return sendError(res, 'Destination not found', 404);
  }

  sendSuccess(res, { destination }, 'Destination fetched successfully');
});

/**
 * @desc    Create new destination
 * @route   POST /api/destinations
 * @access  Private (Admin only)
 */
export const createDestination = asyncHandler(async (req, res) => {
  const {
    name,
    state,
    description,
    shortDescription,
    image,
    gallery,
    highlights,
    bestTime,
    altitude,
    temperature,
    rating,
    startingPrice,
    activities,
  } = req.body;

  const destination = await Destination.create({
    name,
    state,
    description,
    shortDescription,
    image,
    gallery: gallery || [],
    highlights: highlights || [],
    bestTime,
    altitude,
    temperature,
    rating: rating || 4.5,
    startingPrice,
    activities: activities || [],
  });

  sendSuccess(res, { destination }, 'Destination created successfully', 201);
});

/**
 * @desc    Update destination
 * @route   PUT /api/destinations/:id
 * @access  Private (Admin only)
 */
export const updateDestination = asyncHandler(async (req, res) => {
  let destination = await Destination.findById(req.params.id);

  if (!destination) {
    return sendError(res, 'Destination not found', 404);
  }

  destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { destination }, 'Destination updated successfully');
});

/**
 * @desc    Delete destination
 * @route   DELETE /api/destinations/:id
 * @access  Private (Admin only)
 */
export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return sendError(res, 'Destination not found', 404);
  }

  // Soft delete - just set isActive to false
  destination.isActive = false;
  await destination.save();

  sendSuccess(res, null, 'Destination deleted successfully');
});

/**
 * @desc    Hard delete destination
 * @route   DELETE /api/destinations/:id/permanent
 * @access  Private (Admin only)
 */
export const hardDeleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndDelete(req.params.id);

  if (!destination) {
    return sendError(res, 'Destination not found', 404);
  }

  sendSuccess(res, null, 'Destination permanently deleted');
});

/**
 * @desc    Get all states (unique)
 * @route   GET /api/destinations/states
 * @access  Public
 */
export const getStates = asyncHandler(async (req, res) => {
  const states = await Destination.distinct('state', { isActive: true });

  sendSuccess(res, { states }, 'States fetched successfully');
});

/**
 * @desc    Get featured destinations
 * @route   GET /api/destinations/featured
 * @access  Public
 */
export const getFeaturedDestinations = asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;

  const destinations = await Destination.find({
    isActive: true,
    rating: { $gte: 4.5 },
  })
    .sort('-rating')
    .limit(parseInt(limit));

  sendSuccess(res, { destinations }, 'Featured destinations fetched successfully');
});
