import Vehicle from '../models/Vehicle.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';
import { deleteFromCloudinary } from '../middleware/cloudinaryUpload.js';

const parseField = (v) => { if (typeof v === 'string') { try { return JSON.parse(v); } catch { return v; } } return v; };

export const getAllVehicles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, destination, vehicleType, seats, sort = '-createdAt', search } = req.query;
  const query = { availability: true };
  if (destination) query.destination = new RegExp(destination, 'i');
  if (vehicleType) query.vehicleType = vehicleType;
  if (seats) query.seats = { $gte: parseInt(seats) };
  if (search) query.$or = [{ vehicleName: new RegExp(search, 'i') }, { vehicleType: new RegExp(search, 'i') }];

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [vehicles, total] = await Promise.all([
    Vehicle.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
    Vehicle.countDocuments(query),
  ]);
  sendPaginated(res, vehicles, total, page, limit, 'Vehicles fetched successfully');
});

export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return sendError(res, 'Vehicle not found', 404);
  sendSuccess(res, { vehicle }, 'Vehicle fetched successfully');
});

export const getVehiclesByDestination = asyncHandler(async (req, res) => {
  const q = { destination: new RegExp(req.params.destination, 'i'), availability: true };
  if (req.query.seats) q.seats = { $gte: parseInt(req.query.seats) };
  const vehicles = await Vehicle.find(q).sort('-rating');
  sendSuccess(res, { vehicles }, 'Vehicles by destination fetched');
});

export const createVehicle = asyncHandler(async (req, res) => {
  const body = req.body;
  const images = req.uploadedImages?.map((i) => ({ url: i.url, publicId: i.public_id }))
    || parseField(body.images) || [];

  const vehicle = await Vehicle.create({
    vehicleType: body.vehicleType, vehicleName: body.vehicleName, seats: body.seats,
    destination: body.destination, pricePerDay: body.pricePerDay, pricePerKm: body.pricePerKm,
    images, features: parseField(body.features) || [], description: body.description,
    availability: body.availability !== 'false',
  });

  await Activity.create({
    user: req.user._id, type: 'vehicle_created',
    description: `Vehicle added: ${body.vehicleName}`,
    relatedId: vehicle._id, relatedModel: 'Vehicle',
  }).catch(() => {});

  sendSuccess(res, { vehicle }, 'Vehicle created successfully', 201);
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return sendError(res, 'Vehicle not found', 404);
  const body = req.body;
  const updates = { ...body };

  if (req.uploadedImages && req.uploadedImages.length > 0) {
    for (const img of (vehicle.images || [])) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }
    updates.images = req.uploadedImages.map((i) => ({ url: i.url, publicId: i.public_id }));
  }
  if (updates.features) updates.features = parseField(updates.features);

  const updated = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

  await Activity.create({
    user: req.user._id, type: 'vehicle_updated',
    description: `Vehicle updated: ${updated.vehicleName}`,
    relatedId: updated._id, relatedModel: 'Vehicle',
  }).catch(() => {});

  sendSuccess(res, { vehicle: updated }, 'Vehicle updated successfully');
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return sendError(res, 'Vehicle not found', 404);
  for (const img of (vehicle.images || [])) {
    if (img.publicId) await deleteFromCloudinary(img.publicId);
  }
  await Vehicle.findByIdAndDelete(req.params.id);

  await Activity.create({
    user: req.user._id, type: 'vehicle_deleted',
    description: `Vehicle deleted: ${vehicle.vehicleName}`,
    relatedId: vehicle._id, relatedModel: 'Vehicle',
  }).catch(() => {});

  sendSuccess(res, null, 'Vehicle deleted successfully');
});
