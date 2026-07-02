import mongoose from 'mongoose';

const hotelImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
}, { _id: false });

const hotelSchema = new mongoose.Schema(
  {
    destination: { type: String, required: [true, 'Destination is required'], trim: true },
    hotelName: { type: String, required: [true, 'Hotel name is required'], trim: true },
    category: {
      type: String,
      enum: ['Budget', 'Standard', 'Deluxe', 'Luxury'],
      required: [true, 'Category is required'],
    },
    pricePerNight: { type: Number, required: [true, 'Price per night is required'], min: 0 },
    amenities: [{ type: String }],
    images: [hotelImageSchema],
    description: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hotelSchema.index({ destination: 1, availability: 1 });
hotelSchema.index({ hotelName: 'text', destination: 'text' });

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
