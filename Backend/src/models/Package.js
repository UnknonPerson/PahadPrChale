import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
      },
    ],
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
    },
    nights: {
      type: Number,
      required: [true, 'Number of nights is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Package image is required'],
    },
    highlights: [
      {
        type: String,
      },
    ],
    includes: [
      {
        type: String,
      },
    ],
    excludes: [
      {
        type: String,
      },
    ],
    itinerary: [itinerarySchema],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    maxGroup: {
      type: Number,
      default: 10,
      min: [1, 'Group size must be at least 1'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      default: 'Easy',
    },
    category: {
      type: String,
      enum: ['Adventure', 'Cultural', 'Nature', 'Pilgrimage'],
      required: [true, 'Category is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
packageSchema.index({ name: 'text', destination: 'text' });

const Package = mongoose.model('Package', packageSchema);

export default Package;
