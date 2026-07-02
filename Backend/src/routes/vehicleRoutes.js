import { Router } from 'express';
import { getAllVehicles, getVehicle, getVehiclesByDestination, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { uploadMultiple, handleMultipleUploads } from '../middleware/cloudinaryUpload.js';

const router = Router();

router.get('/', getAllVehicles);
router.get('/destination/:destination', getVehiclesByDestination);
router.get('/:id', getVehicle);

router.post('/', protect, adminOnly, uploadMultiple.array('images', 5), handleMultipleUploads('vehicles'), createVehicle);
router.put('/:id', protect, adminOnly, uploadMultiple.array('images', 5), handleMultipleUploads('vehicles'), updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);

export default router;
