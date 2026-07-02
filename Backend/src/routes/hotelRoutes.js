import { Router } from 'express';
import { getAllHotels, getHotel, getHotelsByDestination, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { uploadMultiple, handleMultipleUploads } from '../middleware/cloudinaryUpload.js';

const router = Router();

router.get('/', getAllHotels);
router.get('/destination/:destination', getHotelsByDestination);
router.get('/:id', getHotel);

router.post('/', protect, adminOnly, uploadMultiple.array('images', 5), handleMultipleUploads('hotels'), createHotel);
router.put('/:id', protect, adminOnly, uploadMultiple.array('images', 5), handleMultipleUploads('hotels'), updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

export default router;
