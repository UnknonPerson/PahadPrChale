import Package from '../models/Package.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Get all packages
 * @route   GET /api/packages
 * @access  Public
 */
export const getAllPackages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    difficulty,
    minPrice,
    maxPrice,
    featured,
    search,
    sort = '-createdAt',
  } = req.query;

  // Build query
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (featured === 'true') {
    query.featured = true;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const packages = await Package.find(query)
    .populate('destinations', 'name state image')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Package.countDocuments(query);

  sendPaginated(res, packages, total, page, limit, 'Packages fetched successfully');
});

/**
 * @desc    Get single package
 * @route   GET /api/packages/:id
 * @access  Public
 */
export const getPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id).populate(
    'destinations',
    'name state image shortDescription'
  );

  if (!pkg) {
    return sendError(res, 'Package not found', 404);
  }

  sendSuccess(res, { package: pkg }, 'Package fetched successfully');
});

/**
 * @desc    Create new package
 * @route   POST /api/packages
 * @access  Private (Admin only)
 */
export const createPackage = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    destination,
    destinations,
    duration,
    days,
    nights,
    price,
    originalPrice,
    image,
    highlights,
    includes,
    excludes,
    itinerary,
    maxGroup,
    difficulty,
    category,
    featured,
  } = req.body;

  const pkg = await Package.create({
    name,
    description,
    destination,
    destinations: destinations || [],
    duration,
    days,
    nights,
    price,
    originalPrice,
    image,
    highlights: highlights || [],
    includes: includes || [],
    excludes: excludes || [],
    itinerary: itinerary || [],
    maxGroup,
    difficulty: difficulty || 'Easy',
    category,
    featured: featured || false,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'package_created',
    description: `Package created: ${name} (${duration})`,
    relatedId: pkg._id,
    relatedModel: 'Package',
    metadata: { price, category },
  });

  sendSuccess(res, { package: pkg }, 'Package created successfully', 201);
});

/**
 * @desc    Update package
 * @route   PUT /api/packages/:id
 * @access  Private (Admin only)
 */
export const updatePackage = asyncHandler(async (req, res) => {
  let pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return sendError(res, 'Package not found', 404);
  }

  pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'package_updated',
    description: `Package updated: ${pkg.name}`,
    relatedId: pkg._id,
    relatedModel: 'Package',
  });

  sendSuccess(res, { package: pkg }, 'Package updated successfully');
});

/**
 * @desc    Delete package
 * @route   DELETE /api/packages/:id
 * @access  Private (Admin only)
 */
export const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    return sendError(res, 'Package not found', 404);
  }

  // Soft delete
  pkg.isActive = false;
  await pkg.save();

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'package_deleted',
    description: `Package deleted: ${pkg.name}`,
    relatedId: pkg._id,
    relatedModel: 'Package',
  });

  sendSuccess(res, null, 'Package deleted successfully');
});

/**
 * @desc    Get featured packages
 * @route   GET /api/packages/featured
 * @access  Public
 */
export const getFeaturedPackages = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  // Get top-rated active packages, sorted by rating
  const packages = await Package.find({
    isActive: true,
  })
    .sort('-rating -reviewCount')
    .limit(parseInt(limit));

  sendSuccess(res, { packages }, 'Featured packages fetched successfully');
});

/**
 * @desc    Search packages
 * @route   GET /api/packages/search
 * @access  Public
 */
export const searchPackages = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return sendError(res, 'Search query is required', 400);
  }

  const packages = await Package.find(
    { $text: { $search: q }, isActive: true },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit));

  sendSuccess(res, { packages }, 'Search results fetched successfully');
});
