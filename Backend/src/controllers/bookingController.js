import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Vehicle from '../models/Vehicle.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public (or Private based on requirements)
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    type = 'package',
    packageId,
    vehicleId,
    customerName,
    customerEmail,
    customerPhone,
    travelDate,
    returnDate,
    travelers,
    pickupLocation,
    driverRequired,
    specialRequests,
    totalAmount,
  } = req.body;

  let packageName = '';
  let vehicleName = '';
  let destination = '';
  let calculatedTotal = totalAmount;

  if (type === 'package' || packageId) {
    // Get package details
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return sendError(res, 'Package not found', 404);
    }
    packageName = pkg.name;
    destination = pkg.destination;
    calculatedTotal = totalAmount || pkg.price * travelers;
  } else if (type === 'vehicle' || vehicleId) {
    // Get vehicle details
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }
    vehicleName = vehicle.vehicleName || vehicle.name || 'Vehicle';
    destination = vehicle.destination || '';

    // Calculate days between pickup and return
    if (travelDate && returnDate) {
      const start = new Date(travelDate);
      const end = new Date(returnDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
      calculatedTotal = totalAmount || vehicle.pricePerDay * days;
    } else {
      calculatedTotal = totalAmount || vehicle.pricePerDay;
    }
  }

  const booking = await Booking.create({
    user: req.user?._id || null,
    type: type || (packageId ? 'package' : 'vehicle'),
    package: packageId || null,
    vehicle: vehicleId || null,
    customerName,
    customerEmail,
    customerPhone,
    packageName,
    vehicleName,
    destination,
    travelDate,
    returnDate,
    travelers,
    pickupLocation,
    driverRequired: driverRequired || false,
    totalAmount: calculatedTotal,
    specialRequests: specialRequests || '',
  });

  // Create activity
  await Activity.create({
    user: req.user?._id || null,
    type: 'booking_created',
    description: `New ${type} booking: ${packageName || vehicleName} for ${travelers} ${type === 'vehicle' ? 'passenger(s)' : 'traveler(s)'}`,
    relatedId: booking._id,
    relatedModel: 'Booking',
    metadata: {
      type,
      name: packageName || vehicleName,
      travelers,
      totalAmount: calculatedTotal
    },
  });

  // Notify admin users (would need admin notification logic)
  // For now just create the booking

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

  const previousStatus = booking.status;
  booking.status = status;
  await booking.save();

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'booking_updated',
    description: `Booking status changed from ${previousStatus} to ${status}: ${booking.packageName}`,
    relatedId: booking._id,
    relatedModel: 'Booking',
    metadata: { previousStatus, newStatus: status },
  });

  // Notify user if they exist
  if (booking.user) {
    await Notification.create({
      recipient: booking.user,
      type: `booking_${status}`,
      title: 'Booking Update',
      message: `Your booking for ${booking.packageName} has been ${status}.`,
      relatedId: booking._id,
      relatedModel: 'Booking',
    });
  }

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
 * @desc    Cancel booking (User or Admin)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return sendError(res, 'Booking not found', 404);
  }

  // Check if user owns this booking or is admin
  if (booking.user && booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized to cancel this booking', 403);
  }

  // Only pending or confirmed bookings can be cancelled
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return sendError(res, 'This booking cannot be cancelled', 400);
  }

  const previousStatus = booking.status;
  booking.status = 'cancelled';
  await booking.save();

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'booking_cancelled',
    description: `Booking cancelled: ${booking.packageName || booking.vehicleName}`,
    relatedId: booking._id,
    relatedModel: 'Booking',
    metadata: { previousStatus },
  });

  sendSuccess(res, { booking }, 'Booking cancelled successfully');
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
