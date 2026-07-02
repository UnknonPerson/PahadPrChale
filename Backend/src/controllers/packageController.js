import Package from '../models/Package.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { deleteFromCloudinary } from '../middleware/cloudinaryUpload.js';

export const getAllPackages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, difficulty, minPrice, maxPrice, featured, search, sort = '-createdAt' } = req.query;
  const query = { isActive: true };
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (featured === 'true') query.featured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [packages, total] = await Promise.all([
    Package.find(query).populate('destinations', 'name state image').sort(sort).skip(skip).limit(parseInt(limit)),
    Package.countDocuments(query),
  ]);

  sendPaginated(res, packages, total, page, limit, 'Packages fetched successfully');
});

export const getPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id).populate('destinations', 'name state image shortDescription');
  if (!pkg) return sendError(res, 'Package not found', 404);
  sendSuccess(res, { package: pkg }, 'Package fetched successfully');
});

export const createPackage = asyncHandler(async (req, res) => {
  const body = req.body;

  // Parse JSON arrays/objects if sent as strings (from FormData)
  const parseField = (field) => {
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch { return field; }
    }
    return field;
  };

  // Cloudinary image
  const image = req.uploadedImage?.url || body.image || '';
  const imagePublicId = req.uploadedImage?.public_id || body.imagePublicId || '';

  // Gallery images
  const gallery = req.uploadedImages
    ? req.uploadedImages.map((i) => i.url)
    : parseField(body.gallery) || [];
  const galleryPublicIds = req.uploadedImages
    ? req.uploadedImages.map((i) => i.public_id)
    : parseField(body.galleryPublicIds) || [];

  const pkg = await Package.create({
    name: body.name,
    description: body.description,
    destination: body.destination,
    destinations: parseField(body.destinations) || [],
    duration: body.duration,
    days: body.days,
    nights: body.nights,
    price: body.price,
    originalPrice: body.originalPrice || null,
    image,
    imagePublicId,
    gallery,
    galleryPublicIds,
    highlights: parseField(body.highlights) || [],
    includes: parseField(body.includes) || [],
    excludes: parseField(body.excludes) || [],
    itinerary: parseField(body.itinerary) || [],
    maxGroup: body.maxGroup,
    difficulty: body.difficulty || 'Easy',
    category: body.category,
    featured: body.featured === 'true' || body.featured === true,
  });

  await Activity.create({
    user: req.user._id,
    type: 'package_created',
    description: `Package created: ${body.name}`,
    relatedId: pkg._id,
    relatedModel: 'Package',
    metadata: { price: body.price, category: body.category },
  }).catch(() => {});

  sendSuccess(res, { package: pkg }, 'Package created successfully', 201);
});

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return sendError(res, 'Package not found', 404);

  const body = req.body;
  const parseField = (field) => {
    if (typeof field === 'string') { try { return JSON.parse(field); } catch { return field; } }
    return field;
  };

  const updates = { ...body };

  // Replace image if a new one uploaded
  if (req.uploadedImage) {
    if (pkg.imagePublicId) await deleteFromCloudinary(pkg.imagePublicId);
    updates.image = req.uploadedImage.url;
    updates.imagePublicId = req.uploadedImage.public_id;
  }

  // Parse stringified arrays
  for (const field of ['highlights', 'includes', 'excludes', 'itinerary', 'destinations', 'gallery']) {
    if (updates[field]) updates[field] = parseField(updates[field]);
  }

  const updated = await Package.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  await Activity.create({
    user: req.user._id,
    type: 'package_updated',
    description: `Package updated: ${updated.name}`,
    relatedId: updated._id,
    relatedModel: 'Package',
  }).catch(() => {});

  sendSuccess(res, { package: updated }, 'Package updated successfully');
});

export const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return sendError(res, 'Package not found', 404);

  // Soft delete (preserve Cloudinary images)
  pkg.isActive = false;
  await pkg.save();

  await Activity.create({
    user: req.user._id,
    type: 'package_deleted',
    description: `Package deleted: ${pkg.name}`,
    relatedId: pkg._id,
    relatedModel: 'Package',
  }).catch(() => {});

  sendSuccess(res, null, 'Package deleted successfully');
});

export const getFeaturedPackages = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  const packages = await Package.find({ isActive: true }).sort('-rating -reviewCount').limit(parseInt(limit));
  sendSuccess(res, { packages }, 'Featured packages fetched successfully');
});

export const searchPackages = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;
  if (!q) return sendError(res, 'Search query is required', 400);
  const packages = await Package.find(
    { $text: { $search: q }, isActive: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } }).limit(parseInt(limit));
  sendSuccess(res, { packages }, 'Search results fetched successfully');
});
