import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination is required'],
    },
    hotelName: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Budget', 'Standard', 'Deluxe', 'Luxury'],
      required: [true, 'Hotel category is required'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
