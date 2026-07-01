import Hotel from '../models/Hotel.js';
import Destination from '../models/Destination.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Get all hotels
 * @route   GET /api/hotels
 * @access  Public
 */
export const getAllHotels = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    destination,
    category,
    minPrice,
    maxPrice,
    sort = '-rating',
  } = req.query;

  // Build query
  const query = { availability: true };

  if (destination) {
    query.destination = destination;
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = parseInt(minPrice);
    if (maxPrice) query.pricePerNight.$lte = parseInt(maxPrice);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const hotels = await Hotel.find(query)
    .populate('destination', 'name state')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Hotel.countDocuments(query);

  sendPaginated(res, hotels, total, page, limit, 'Hotels fetched successfully');
});

/**
 * @desc    Get single hotel
 * @route   GET /api/hotels/:id
 * @access  Public
 */
export const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate(
    'destination',
    'name state image'
  );

  if (!hotel) {
    return sendError(res, 'Hotel not found', 404);
  }

  sendSuccess(res, { hotel }, 'Hotel fetched successfully');
});

/**
 * @desc    Create new hotel
 * @route   POST /api/hotels
 * @access  Private (Admin only)
 */
export const createHotel = asyncHandler(async (req, res) => {
  const {
    destination,
    hotelName,
    category,
    pricePerNight,
    amenities,
    images,
    description,
    address,
    contactNumber,
    rating,
  } = req.body;

  // Verify destination exists
  const destExists = await Destination.findById(destination);
  if (!destExists) {
    return sendError(res, 'Destination not found', 404);
  }

  const hotel = await Hotel.create({
    destination,
    hotelName,
    category,
    pricePerNight,
    amenities: amenities || [],
    images: images || [],
    description,
    address,
    contactNumber,
    rating: rating || 4.0,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'hotel_created',
    description: `Hotel created: ${hotelName} (${category})`,
    relatedId: hotel._id,
    relatedModel: 'Hotel',
    metadata: { pricePerNight, category },
  });

  sendSuccess(res, { hotel }, 'Hotel created successfully', 201);
});

/**
 * @desc    Update hotel
 * @route   PUT /api/hotels/:id
 * @access  Private (Admin only)
 */
export const updateHotel = asyncHandler(async (req, res) => {
  let hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return sendError(res, 'Hotel not found', 404);
  }

  hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'hotel_updated',
    description: `Hotel updated: ${hotel.hotelName}`,
    relatedId: hotel._id,
    relatedModel: 'Hotel',
  });

  sendSuccess(res, { hotel }, 'Hotel updated successfully');
});

/**
 * @desc    Delete hotel
 * @route   DELETE /api/hotels/:id
 * @access  Private (Admin only)
 */
export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return sendError(res, 'Hotel not found', 404);
  }

  const hotelName = hotel.hotelName;
  const hotelId = hotel._id;

  await hotel.deleteOne();

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'hotel_deleted',
    description: `Hotel deleted: ${hotelName}`,
    relatedId: hotelId,
    relatedModel: 'Hotel',
  });

  sendSuccess(res, null, 'Hotel deleted successfully');
});

/**
 * @desc    Get hotels by destination
 * @route   GET /api/hotels/destination/:destinationId
 * @access  Public
 */
export const getHotelsByDestination = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    destination: req.params.destinationId,
    availability: true,
  }).sort('pricePerNight');

  sendSuccess(res, { hotels }, 'Hotels fetched successfully');
});
