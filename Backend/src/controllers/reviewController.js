import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Create a review for a booked package
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment, title } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user._id,
  }).populate('package');

  if (!booking) {
    return sendError(res, 'Booking not found or not authorized', 404);
  }

  // Check if booking is completed or confirmed
  if (!['completed', 'confirmed'].includes(booking.status)) {
    return sendError(
      res,
      'You can only review packages for completed or confirmed bookings',
      400
    );
  }

  // Check if review already exists for this booking
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    return sendError(res, 'You have already reviewed this booking', 400);
  }

  // Create review
  const review = await Review.create({
    user: req.user._id,
    package: booking.package._id,
    booking: bookingId,
    rating,
    comment,
    title: title || `Review for ${booking.packageName}`,
  });

  // Notify admins
  const admins = await User.find({ role: 'admin' });
  await Promise.all(
    admins.map((admin) =>
      Notification.create({
        recipient: admin._id,
        type: 'new_review',
        title: 'New Package Review',
        message: `${req.user.name} reviewed ${booking.packageName} with ${rating} stars`,
        relatedId: review._id,
        relatedModel: 'Review',
      })
    )
  );

  sendSuccess(res, { review }, 'Review submitted successfully', 201);
});

/**
 * @desc    Get reviews for a package
 * @route   GET /api/reviews/package/:packageId
 * @access  Public
 */
export const getPackageReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({
    package: req.params.packageId,
    status: 'approved',
  })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({
    package: req.params.packageId,
    status: 'approved',
  });

  sendPaginated(res, reviews, total, page, limit, 'Reviews fetched successfully');
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/my
 * @access  Private
 */
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('package', 'name image destination')
    .sort({ createdAt: -1 });

  sendSuccess(res, { reviews }, 'Your reviews fetched successfully');
});

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.package) {
    filter.package = req.query.package;
  }

  const reviews = await Review.find(filter)
    .populate('user', 'name email profileImage')
    .populate('package', 'name destination')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  sendPaginated(res, reviews, total, page, limit, 'Reviews fetched successfully');
});

/**
 * @desc    Get review statistics
 * @route   GET /api/reviews/stats
 * @access  Public
 */
export const getReviewStats = asyncHandler(async (req, res) => {
  const stats = await Review.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$package',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'packages',
        localField: '_id',
        foreignField: '_id',
        as: 'packageInfo',
      },
    },
    {
      $unwind: '$packageInfo',
    },
    {
      $project: {
        packageName: '$packageInfo.name',
        averageRating: { $round: ['$averageRating', 1] },
        reviewCount: 1,
      },
    },
    { $sort: { averageRating: -1, reviewCount: -1 } },
  ]);

  const totalReviews = await Review.countDocuments({ status: 'approved' });
  const averageOverall = await Review.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);

  sendSuccess(
    res,
    {
      stats,
      totalReviews,
      averageRating: averageOverall[0]?.avgRating
        ? Math.round(averageOverall[0].avgRating * 10) / 10
        : 0,
    },
    'Review stats fetched successfully'
  );
});

/**
 * @desc    Update review status (Admin)
 * @route   PUT /api/reviews/:id/status
 * @access  Private/Admin
 */
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const review = await Review.findById(req.params.id);
  if (!review) {
    return sendError(res, 'Review not found', 404);
  }

  review.status = status;
  await review.save();

  // Recalculate package rating
  await Review.calculatePackageRating(review.package);

  sendSuccess(res, { review }, 'Review status updated successfully');
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return sendError(res, 'Review not found', 404);
  }

  // Check ownership or admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized', 403);
  }

  const packageId = review.package;
  await review.deleteOne();

  // Recalculate package rating
  await Review.calculatePackageRating(packageId);

  sendSuccess(res, null, 'Review deleted successfully');
});

/**
 * @desc    Check if user can review a booking
 * @route   GET /api/reviews/can-review/:bookingId
 * @access  Private
 */
export const canReviewBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    user: req.user._id,
  });

  if (!booking) {
    return sendSuccess(res, { canReview: false, reason: 'Booking not found' }, 'Checked');
  }

  if (!['completed', 'confirmed'].includes(booking.status)) {
    return sendSuccess(
      res,
      { canReview: false, reason: 'Booking must be completed or confirmed' },
      'Checked'
    );
  }

  const existingReview = await Review.findOne({ booking: req.params.bookingId });
  if (existingReview) {
    return sendSuccess(res, { canReview: false, reason: 'Already reviewed', review: existingReview }, 'Checked');
  }

  sendSuccess(res, { canReview: true, booking }, 'User can review this booking');
});
