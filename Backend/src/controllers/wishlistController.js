import WishlistItem from '../models/WishlistItem.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const items = await WishlistItem.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, { items }, 'Wishlist fetched successfully');
});

// POST /api/wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { itemId, itemType, name, image, price, priceLabel, destination, description } = req.body;

  if (!itemId || !itemType || !name) {
    return sendError(res, 'itemId, itemType, and name are required', 400);
  }

  // Upsert — update if exists, insert if not
  const item = await WishlistItem.findOneAndUpdate(
    { user: req.user._id, itemId },
    {
      user: req.user._id,
      itemId,
      itemType,
      name,
      image: image || '',
      price: price ?? null,
      priceLabel: priceLabel || '',
      destination: destination || '',
      description: description || '',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { item }, 'Added to wishlist', 201);
});

// DELETE /api/wishlist/:itemId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const deleted = await WishlistItem.findOneAndDelete({
    user: req.user._id,
    itemId: req.params.itemId,
  });

  if (!deleted) return sendError(res, 'Item not found in wishlist', 404);
  sendSuccess(res, null, 'Removed from wishlist');
});

// DELETE /api/wishlist (clear all)
export const clearWishlist = asyncHandler(async (req, res) => {
  await WishlistItem.deleteMany({ user: req.user._id });
  sendSuccess(res, null, 'Wishlist cleared');
});
