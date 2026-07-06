import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/clear', clearWishlist);
router.delete('/:itemId', removeFromWishlist);

export default router;
