import mongoose from 'mongoose';

const vehicleImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
}, { _id: false });

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      enum: ['SUV', 'Sedan', 'Hatchback', 'Tempo Traveller', 'Bus', 'Luxury', 'Bike'],
      required: [true, 'Vehicle type is required'],
    },
    vehicleName: { type: String, required: [true, 'Vehicle name is required'], trim: true },
    seats: { type: Number, required: [true, 'Seat count is required'], min: 1, max: 50 },
    destination: { type: String, trim: true },
    pricePerDay: { type: Number, required: [true, 'Price per day is required'], min: 0 },
    pricePerKm: { type: Number, min: 0, default: 0 },
    availability: { type: Boolean, default: true },
    images: [vehicleImageSchema],
    features: [{ type: String }],
    description: { type: String },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

vehicleSchema.index({ destination: 1, availability: 1 });
vehicleSchema.index({ vehicleName: 'text', vehicleType: 'text' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
