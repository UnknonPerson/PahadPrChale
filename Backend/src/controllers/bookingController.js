import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public (or Private based on requirements)
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    packageId,
    customerName,
    customerEmail,
    customerPhone,
    travelDate,
    travelers,
    specialRequests,
  } = req.body;

  // Get package details
  const pkg = await Package.findById(packageId);
  if (!pkg) {
    return sendError(res, 'Package not found', 404);
  }

  // Calculate total amount
  const totalAmount = pkg.price * travelers;

  const booking = await Booking.create({
    user: req.user?._id || null,
    package: packageId,
    customerName,
    customerEmail,
    customerPhone,
    packageName: pkg.name,
    destination: pkg.destination,
    travelDate,
    travelers,
    totalAmount,
    specialRequests: specialRequests || '',
  });

  sendSuccess(res, { booking }, 'Booking created successfully', 201);
});

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/bookings
 * @access  Private (Admin only)
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sort = '-createdAt',
  } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
      { packageName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const bookings = await Booking.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Booking.countDocuments(query);

  sendPaginated(res, bookings, total, page, limit, 'Bookings fetched successfully');
});

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    'package',
    'name image duration category'
  );

  if (!booking) {
    return sendError(res, 'Booking not found', 404);
  }

  sendSuccess(res, { booking }, 'Booking fetched successfully');
});

/**
 * @desc    Update booking status
 * @route   PUT /api/bookings/:id/status
 * @access  Private (Admin only)
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return sendError(res, 'Booking not found', 404);
  }

  booking.status = status;
  await booking.save();

  sendSuccess(res, { booking }, 'Booking status updated successfully');
});

/**
 * @desc    Delete booking
 * @route   DELETE /api/bookings/:id
 * @access  Private (Admin only)
 */
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return sendError(res, 'Booking not found', 404);
  }

  await booking.deleteOne();

  sendSuccess(res, null, 'Booking deleted successfully');
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('package', 'name image duration destination')
    .sort('-createdAt');

  sendSuccess(res, { bookings }, 'Your bookings fetched successfully');
});

/**
 * @desc    Get booking statistics
 * @route   GET /api/bookings/stats
 * @access  Private (Admin only)
 */
export const getBookingStats = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
      },
    },
  ]);

  const totalBookings = await Booking.countDocuments();
  const totalRevenue = await Booking.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  sendSuccess(
    res,
    {
      stats,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    'Booking statistics fetched successfully'
  );
});
