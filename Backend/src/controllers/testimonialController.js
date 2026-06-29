import Testimonial from '../models/Testimonial.js';
import Destination from '../models/Destination.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Get all testimonials
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    featured,
    sort = '-createdAt',
  } = req.query;

  // Build query
  const query = {};

  // For public, only show approved
  if (req.user?.role !== 'admin') {
    query.status = 'approved';
  } else if (status) {
    query.status = status;
  }

  if (featured === 'true') {
    query.isFeatured = true;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const testimonials = await Testimonial.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Testimonial.countDocuments(query);

  sendPaginated(res, testimonials, total, page, limit, 'Testimonials fetched successfully');
});

/**
 * @desc    Get single testimonial
 * @route   GET /api/testimonials/:id
 * @access  Public
 */
export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return sendError(res, 'Testimonial not found', 404);
  }

  sendSuccess(res, { testimonial }, 'Testimonial fetched successfully');
});

/**
 * @desc    Create testimonial
 * @route   POST /api/testimonials
 * @access  Private
 */
export const createTestimonial = asyncHandler(async (req, res) => {
  const { destination, packageName, rating, title, review } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    return sendError(res, 'Rating must be between 1 and 5', 400);
  }

  // Verify destination exists if provided
  if (destination) {
    const destExists = await Destination.findById(destination);
    if (!destExists) {
      return sendError(res, 'Destination not found', 404);
    }
  }

  const testimonial = await Testimonial.create({
    user: req.user._id,
    destination,
    packageName,
    rating,
    title,
    review,
  });

  sendSuccess(res, { testimonial }, 'Testimonial submitted successfully', 201);
});

/**
 * @desc    Update testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private
 */
export const updateTestimonial = asyncHandler(async (req, res) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return sendError(res, 'Testimonial not found', 404);
  }

  // Check ownership
  if (testimonial.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized to update this testimonial', 403);
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { testimonial }, 'Testimonial updated successfully');
});

/**
 * @desc    Delete testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private
 */
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return sendError(res, 'Testimonial not found', 404);
  }

  // Check ownership
  if (testimonial.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized to delete this testimonial', 403);
  }

  await testimonial.deleteOne();

  sendSuccess(res, null, 'Testimonial deleted successfully');
});

/**
 * @desc    Approve testimonial (Admin)
 * @route   PUT /api/testimonials/:id/approve
 * @access  Private (Admin only)
 */
export const approveTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return sendError(res, 'Testimonial not found', 404);
  }

  testimonial.status = 'approved';
  await testimonial.save();

  sendSuccess(res, { testimonial }, 'Testimonial approved successfully');
});

/**
 * @desc    Reject testimonial (Admin)
 * @route   PUT /api/testimonials/:id/reject
 * @access  Private (Admin only)
 */
export const rejectTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return sendError(res, 'Testimonial not found', 404);
  }

  testimonial.status = 'rejected';
  await testimonial.save();

  sendSuccess(res, { testimonial }, 'Testimonial rejected successfully');
});

/**
 * @desc    Feature/Unfeature testimonial (Admin)
 * @route   PUT /api/testimonials/:id/feature
 * @access  Private (Admin only)
 */
export const toggleFeature = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return sendError(res, 'Testimonial not found', 404);
  }

  testimonial.isFeatured = !testimonial.isFeatured;
  await testimonial.save();

  sendSuccess(
    res,
    { testimonial },
    `Testimonial ${testimonial.isFeatured ? 'featured' : 'unfeatured'} successfully`
  );
});

/**
 * @desc    Get featured testimonials
 * @route   GET /api/testimonials/featured
 * @access  Public
 */
export const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const { limit = 3 } = req.query;

  const testimonials = await Testimonial.find({
    status: 'approved',
    isFeatured: true,
  })
    .sort('-rating')
    .limit(parseInt(limit));

  sendSuccess(res, { testimonials }, 'Featured testimonials fetched successfully');
});
