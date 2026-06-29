import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    image: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    gallery: [
      {
        type: String,
      },
    ],
    highlights: [
      {
        type: String,
      },
    ],
    bestTime: {
      type: String,
      default: '',
    },
    altitude: {
      type: String,
      default: '',
    },
    temperature: {
      type: String,
      default: '',
    },
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
    startingPrice: {
      type: Number,
      default: 0,
    },
    activities: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search
destinationSchema.index({ name: 'text', state: 'text' });

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
