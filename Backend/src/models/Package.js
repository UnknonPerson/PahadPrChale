import mongoose from 'mongoose';

const itineraryItemSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Package name is required'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Description is required'] },
    destination: { type: String, required: [true, 'Destination is required'], trim: true },
    destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    duration: { type: String, required: [true, 'Duration is required'] },
    days: { type: Number, min: 1 },
    nights: { type: Number, min: 0 },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, min: 0 },

    // Cloudinary image
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    gallery: [{ type: String }],
    galleryPublicIds: [{ type: String }],

    highlights: [{ type: String }],
    includes: [{ type: String }],
    excludes: [{ type: String }],
    itinerary: [itineraryItemSchema],

    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    maxGroup: { type: Number, default: 12 },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], default: 'Easy' },
    category: { type: String, enum: ['Adventure', 'Cultural', 'Nature', 'Pilgrimage', 'Wildlife', 'Beach', 'Honeymoon', 'Family'], required: true },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

packageSchema.index({ name: 'text', destination: 'text', description: 'text' });
packageSchema.index({ isActive: 1, featured: -1, rating: -1 });
packageSchema.index({ category: 1, isActive: 1 });

const Package = mongoose.model('Package', packageSchema);
export default Package;
