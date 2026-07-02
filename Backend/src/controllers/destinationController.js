import Destination from '../models/Destination.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { deleteFromCloudinary } from '../middleware/cloudinaryUpload.js';

const parseField = (field) => {
  if (typeof field === 'string') { try { return JSON.parse(field); } catch { return field; } }
  return field;
};

export const getAllDestinations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, state, search, featured, sort = '-createdAt' } = req.query;
  const query = { isActive: true };
  if (state) query.state = state;
  if (featured === 'true') query.featured = true;
  if (search) query.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [destinations, total] = await Promise.all([
    Destination.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
    Destination.countDocuments(query),
  ]);
  sendPaginated(res, destinations, total, page, limit, 'Destinations fetched successfully');
});

export const getDestination = asyncHandler(async (req, res) => {
  const dest = await Destination.findById(req.params.id);
  if (!dest) return sendError(res, 'Destination not found', 404);
  sendSuccess(res, { destination: dest }, 'Destination fetched successfully');
});

export const createDestination = asyncHandler(async (req, res) => {
  const body = req.body;
  const image = req.uploadedImage?.url || body.image || '';
  const imagePublicId = req.uploadedImage?.public_id || '';
  const gallery = req.uploadedImages?.map((i) => i.url) || parseField(body.gallery) || [];
  const galleryPublicIds = req.uploadedImages?.map((i) => i.public_id) || [];

  const dest = await Destination.create({
    name: body.name, state: body.state, description: body.description,
    shortDescription: body.shortDescription, image, imagePublicId, gallery, galleryPublicIds,
    highlights: parseField(body.highlights) || [],
    activities: parseField(body.activities) || [],
    bestTime: body.bestTime, altitude: body.altitude, temperature: body.temperature,
    startingPrice: body.startingPrice, isActive: true,
  });

  await Activity.create({
    user: req.user._id, type: 'destination_created',
    description: `Destination created: ${body.name}`, relatedId: dest._id, relatedModel: 'Destination',
  }).catch(() => {});

  sendSuccess(res, { destination: dest }, 'Destination created successfully', 201);
});

export const updateDestination = asyncHandler(async (req, res) => {
  const dest = await Destination.findById(req.params.id);
  if (!dest) return sendError(res, 'Destination not found', 404);

  const body = req.body;
  const updates = { ...body };

  if (req.uploadedImage) {
    if (dest.imagePublicId) await deleteFromCloudinary(dest.imagePublicId);
    updates.image = req.uploadedImage.url;
    updates.imagePublicId = req.uploadedImage.public_id;
  }

  for (const field of ['highlights', 'activities', 'gallery']) {
    if (updates[field]) updates[field] = parseField(updates[field]);
  }

  const updated = await Destination.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  await Activity.create({
    user: req.user._id, type: 'destination_updated',
    description: `Destination updated: ${updated.name}`, relatedId: updated._id, relatedModel: 'Destination',
  }).catch(() => {});

  sendSuccess(res, { destination: updated }, 'Destination updated successfully');
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const dest = await Destination.findById(req.params.id);
  if (!dest) return sendError(res, 'Destination not found', 404);
  dest.isActive = false;
  await dest.save();

  await Activity.create({
    user: req.user._id, type: 'destination_deleted',
    description: `Destination deleted: ${dest.name}`, relatedId: dest._id, relatedModel: 'Destination',
  }).catch(() => {});

  sendSuccess(res, null, 'Destination deleted successfully');
});

export const permanentDeleteDestination = asyncHandler(async (req, res) => {
  const dest = await Destination.findById(req.params.id);
  if (!dest) return sendError(res, 'Destination not found', 404);
  if (dest.imagePublicId) await deleteFromCloudinary(dest.imagePublicId);
  for (const pid of (dest.galleryPublicIds || [])) await deleteFromCloudinary(pid);
  await Destination.findByIdAndDelete(req.params.id);
  sendSuccess(res, null, 'Destination permanently deleted');
});

export const getStates = asyncHandler(async (req, res) => {
  const states = await Destination.distinct('state', { isActive: true });
  sendSuccess(res, { states }, 'States fetched successfully');
});

export const getFeaturedDestinations = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  const dests = await Destination.find({ isActive: true }).sort('-rating -reviewCount').limit(parseInt(limit));
  sendSuccess(res, { destinations: dests }, 'Featured destinations fetched');
});
