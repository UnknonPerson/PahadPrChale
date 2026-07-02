import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { deleteFromCloudinary } from '../middleware/cloudinaryUpload.js';

const parseField = (v) => { if (typeof v === 'string') { try { return JSON.parse(v); } catch { return v; } } return v; };

export const getAllHotels = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, destination, category, sort = '-createdAt', search } = req.query;
  const query = { availability: true };
  if (destination) query.destination = new RegExp(destination, 'i');
  if (category) query.category = category;
  if (search) query.$or = [{ hotelName: new RegExp(search, 'i') }, { destination: new RegExp(search, 'i') }];

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [hotels, total] = await Promise.all([
    Hotel.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
    Hotel.countDocuments(query),
  ]);
  sendPaginated(res, hotels, total, page, limit, 'Hotels fetched successfully');
});

export const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return sendError(res, 'Hotel not found', 404);
  sendSuccess(res, { hotel }, 'Hotel fetched successfully');
});

export const getHotelsByDestination = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    destination: new RegExp(req.params.destination, 'i'),
    availability: true,
  }).sort('-rating');
  sendSuccess(res, { hotels }, 'Hotels by destination fetched');
});

export const createHotel = asyncHandler(async (req, res) => {
  const body = req.body;
  const images = req.uploadedImages?.map((i) => ({ url: i.url, publicId: i.public_id }))
    || parseField(body.images) || [];

  const hotel = await Hotel.create({
    destination: body.destination, hotelName: body.hotelName, category: body.category,
    pricePerNight: body.pricePerNight, amenities: parseField(body.amenities) || [],
    images, description: body.description, address: body.address,
    contactNumber: body.contactNumber, availability: body.availability !== 'false',
  });

  await Activity.create({
    user: req.user._id, type: 'hotel_created',
    description: `Hotel added: ${body.hotelName} in ${body.destination}`,
    relatedId: hotel._id, relatedModel: 'Hotel',
  }).catch(() => {});

  sendSuccess(res, { hotel }, 'Hotel created successfully', 201);
});

export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return sendError(res, 'Hotel not found', 404);
  const body = req.body;
  const updates = { ...body };

  if (req.uploadedImages && req.uploadedImages.length > 0) {
    for (const img of (hotel.images || [])) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }
    updates.images = req.uploadedImages.map((i) => ({ url: i.url, publicId: i.public_id }));
  }
  if (updates.amenities) updates.amenities = parseField(updates.amenities);

  const updated = await Hotel.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  await Activity.create({
    user: req.user._id, type: 'hotel_updated',
    description: `Hotel updated: ${updated.hotelName}`,
    relatedId: updated._id, relatedModel: 'Hotel',
  }).catch(() => {});

  sendSuccess(res, { hotel: updated }, 'Hotel updated successfully');
});

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return sendError(res, 'Hotel not found', 404);

  for (const img of (hotel.images || [])) {
    if (img.publicId) await deleteFromCloudinary(img.publicId);
  }
  await Hotel.findByIdAndDelete(req.params.id);

  await Activity.create({
    user: req.user._id, type: 'hotel_deleted',
    description: `Hotel deleted: ${hotel.hotelName}`,
    relatedId: hotel._id, relatedModel: 'Hotel',
  }).catch(() => {});

  sendSuccess(res, null, 'Hotel deleted successfully');
});
