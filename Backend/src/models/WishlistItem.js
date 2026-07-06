import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      enum: ['package', 'hotel', 'destination', 'vehicle'],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    price: { type: Number, default: null },
    priceLabel: { type: String, default: '' },
    destination: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

// One entry per user per item
wishlistItemSchema.index({ user: 1, itemId: 1 }, { unique: true });

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);
export default WishlistItem;
