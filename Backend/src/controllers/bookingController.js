import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Vehicle from '../models/Vehicle.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import emailService from '../utils/emailService.js';

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
    const pkg = await Package.findById(packageId);
    if (!pkg) return sendError(res, 'Package not found', 404);
    packageName = pkg.name;
    destination = pkg.destination;
    calculatedTotal = totalAmount || pkg.price * travelers;
  } else if (type === 'vehicle' || vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return sendError(res, 'Vehicle not found', 404);
    vehicleName = vehicle.vehicleName || vehicle.name || 'Vehicle';
    destination = vehicle.destination || '';
    if (travelDate && returnDate) {
      const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(travelDate)) / 86400000));
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

  // Send booking confirmation email (non-blocking)
  if (customerEmail) {
    emailService.sendBookingConfirmation(customerEmail, booking);
  }

  await Activity.create({
    user: req.user?._id || null,
    type: 'booking_created',
    description: `New ${type} booking: ${packageName || vehicleName} for ${travelers} traveler(s)`,
    relatedId: booking._id,
    relatedModel: 'Booking',
    metadata: { type, name: packageName || vehicleName, travelers, totalAmount: calculatedTotal },
  }).catch(() => {});

  sendSuccess(res, { booking }, 'Booking created successfully', 201);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search, type, sort = '-createdAt' } = req.query;
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;
  if (search) {
    query.$or = [
      { customerName: new RegExp(search, 'i') },
      { customerEmail: new RegExp(search, 'i') },
      { packageName: new RegExp(search, 'i') },
      { vehicleName: new RegExp(search, 'i') },
      { bookingId: new RegExp(search, 'i') },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
    Booking.countDocuments(query),
  ]);

  sendPaginated(res, bookings, total, page, limit, 'Bookings fetched successfully');
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('package', 'name image duration category destination')
    .populate('vehicle', 'vehicleName images vehicleType');
  sendSuccess(res, { bookings }, 'Your bookings fetched successfully');
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('package', 'name image duration category')
    .populate('vehicle', 'vehicleName images vehicleType');
  if (!booking) return sendError(res, 'Booking not found', 404);

  // Users can only see their own bookings; admins see all
  if (req.user.role !== 'admin' && String(booking.user) !== String(req.user.id)) {
    return sendError(res, 'Not authorized to view this booking', 403);
  }

  sendSuccess(res, { booking }, 'Booking fetched successfully');
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];
  if (!allowedStatuses.includes(status)) return sendError(res, 'Invalid status', 400);

  const booking = await Booking.findById(req.params.id);
  if (!booking) return sendError(res, 'Booking not found', 404);

  const previousStatus = booking.status;
  booking.status = status;
  await booking.save();

  // Send appropriate email
  const email = booking.customerEmail;
  if (email) {
    if (status === 'confirmed') emailService.sendBookingApproved(email, booking);
    else if (status === 'cancelled') emailService.sendBookingCancelled(email, booking, reason);
    else if (status === 'rejected') emailService.sendBookingRejected(email, booking, reason);
  }

  // In-app notification
  if (booking.user) {
    await Notification.create({
      recipient: booking.user,
      type: `booking_${status === 'confirmed' ? 'approved' : status}`,
      title: 'Booking Update',
      message: `Your booking (${booking.bookingId}) for ${booking.packageName || booking.vehicleName} has been ${status}.`,
      relatedId: booking._id,
      relatedModel: 'Booking',
    }).catch(() => {});
  }

  await Activity.create({
    user: req.user._id,
    type: 'booking_updated',
    description: `Booking ${booking.bookingId} status: ${previousStatus} → ${status}`,
    relatedId: booking._id,
    relatedModel: 'Booking',
    metadata: { previousStatus, newStatus: status },
  }).catch(() => {});

  sendSuccess(res, { booking }, `Booking ${status} successfully`);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return sendError(res, 'Booking not found', 404);

  if (req.user.role !== 'admin' && String(booking.user) !== String(req.user.id)) {
    return sendError(res, 'Not authorized', 403);
  }
  if (booking.status === 'cancelled') return sendError(res, 'Booking is already cancelled', 400);
  if (booking.status === 'completed') return sendError(res, 'Cannot cancel a completed booking', 400);

  booking.status = 'cancelled';
  await booking.save();

  if (booking.customerEmail) {
    emailService.sendBookingCancelled(booking.customerEmail, booking, 'Cancelled by user');
  }

  await Activity.create({
    user: req.user._id,
    type: 'booking_cancelled',
    description: `Booking ${booking.bookingId} cancelled`,
    relatedId: booking._id,
    relatedModel: 'Booking',
  }).catch(() => {});

  sendSuccess(res, { booking }, 'Booking cancelled successfully');
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return sendError(res, 'Booking not found', 404);

  await Booking.findByIdAndDelete(req.params.id);

  await Activity.create({
    user: req.user._id,
    type: 'booking_updated',
    description: `Booking ${booking.bookingId} deleted permanently`,
    relatedId: booking._id,
    relatedModel: 'Booking',
    metadata: { action: 'deleted' },
  }).catch(() => {});

  sendSuccess(res, null, 'Booking deleted successfully');
});

export const getBookingStats = asyncHandler(async (req, res) => {
  const [total, pending, confirmed, completed, cancelled, revenue] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: 'completed' }),
    Booking.countDocuments({ status: 'cancelled' }),
    Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);

  sendSuccess(res, {
    stats: {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      revenue: revenue[0]?.total || 0,
    },
  }, 'Booking stats fetched');
});
