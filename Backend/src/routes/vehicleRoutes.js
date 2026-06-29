import express from 'express';
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDestination,
} from '../controllers/vehicleController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.get('/destination/:destinationId', getVehiclesByDestination);
router.get('/', getAllVehicles);
router.get('/:id', getVehicle);

// Admin protected routes
router.post('/', protect, adminOnly, createVehicle);
router.put('/:id', protect, adminOnly, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);

export default router;
