import Vehicle from '../models/Vehicle.js';
import Destination from '../models/Destination.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js';

/**
 * @desc    Get all vehicles
 * @route   GET /api/vehicles
 * @access  Public
 */
export const getAllVehicles = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    destination,
    minSeats,
    maxPrice,
    sort = 'pricePerDay',
  } = req.query;

  // Build query
  const query = { availability: true };

  if (destination) {
    query.destination = destination;
  }

  if (minSeats) {
    query.seats = { $gte: parseInt(minSeats) };
  }

  if (maxPrice) {
    query.pricePerDay = { $lte: parseInt(maxPrice) };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const vehicles = await Vehicle.find(query)
    .populate('destination', 'name state')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Vehicle.countDocuments(query);

  sendPaginated(res, vehicles, total, page, limit, 'Vehicles fetched successfully');
});

/**
 * @desc    Get single vehicle
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate(
    'destination',
    'name state image'
  );

  if (!vehicle) {
    return sendError(res, 'Vehicle not found', 404);
  }

  sendSuccess(res, { vehicle }, 'Vehicle fetched successfully');
});

/**
 * @desc    Create new vehicle
 * @route   POST /api/vehicles
 * @access  Private (Admin only)
 */
export const createVehicle = asyncHandler(async (req, res) => {
  const {
    vehicleType,
    vehicleName,
    seats,
    destination,
    pricePerDay,
    pricePerKm,
    images,
    features,
    description,
  } = req.body;

  // Verify destination exists
  const destExists = await Destination.findById(destination);
  if (!destExists) {
    return sendError(res, 'Destination not found', 404);
  }

  const vehicle = await Vehicle.create({
    vehicleType,
    vehicleName,
    seats,
    destination,
    pricePerDay,
    pricePerKm,
    images: images || [],
    features: features || [],
    description,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'vehicle_created',
    description: `Vehicle created: ${vehicleName} (${vehicleType})`,
    relatedId: vehicle._id,
    relatedModel: 'Vehicle',
    metadata: { seats, pricePerDay },
  });

  sendSuccess(res, { vehicle }, 'Vehicle created successfully', 201);
});

/**
 * @desc    Update vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Private (Admin only)
 */
export const updateVehicle = asyncHandler(async (req, res) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return sendError(res, 'Vehicle not found', 404);
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'vehicle_updated',
    description: `Vehicle updated: ${vehicle.vehicleName}`,
    relatedId: vehicle._id,
    relatedModel: 'Vehicle',
  });

  sendSuccess(res, { vehicle }, 'Vehicle updated successfully');
});

/**
 * @desc    Delete vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Admin only)
 */
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return sendError(res, 'Vehicle not found', 404);
  }

  const vehicleName = vehicle.vehicleName;
  const vehicleId = vehicle._id;

  await vehicle.deleteOne();

  // Create activity
  await Activity.create({
    user: req.user._id,
    type: 'vehicle_deleted',
    description: `Vehicle deleted: ${vehicleName}`,
    relatedId: vehicleId,
    relatedModel: 'Vehicle',
  });

  sendSuccess(res, null, 'Vehicle deleted successfully');
});

/**
 * @desc    Get vehicles by destination
 * @route   GET /api/vehicles/destination/:destinationId
 * @access  Public
 */
export const getVehiclesByDestination = asyncHandler(async (req, res) => {
  const { seats } = req.query;

  const query = {
    destination: req.params.destinationId,
    availability: true,
  };

  if (seats) {
    query.seats = { $gte: parseInt(seats) };
  }

  const vehicles = await Vehicle.find(query).sort('pricePerDay');

  sendSuccess(res, { vehicles }, 'Vehicles fetched successfully');
});
