import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    destinations: [
      {
        destination: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Destination',
          required: true,
        },
        days: {
          type: Number,
          default: 1,
        },
      },
    ],
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'At least 1 adult is required'],
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children cannot be negative'],
    },
    hotelCategory: {
      type: String,
      enum: ['Budget', 'Standard', 'Deluxe', 'Luxury'],
      default: 'Standard',
    },
    transportType: {
      type: String,
      enum: ['Private', 'Shared', 'Self-Drive'],
      default: 'Private',
    },
    budget: {
      type: Number,
      default: 0,
    },
    specialRequirements: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Populate user and destinations on find
tripSchema.pre(/^find/, function (next) {
  this.populate('user', 'name email phone')
    .populate('destinations.destination', 'name state image');
  next();
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
