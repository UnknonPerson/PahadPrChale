import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
    },
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Vehicle must have at least 1 seat'],
      max: [50, 'Vehicle cannot have more than 50 seats'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
    },
    pricePerKm: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
