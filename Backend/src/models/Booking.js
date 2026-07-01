import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['package', 'vehicle'],
      default: 'package',
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
    },
    packageName: {
      type: String,
    },
    vehicleName: {
      type: String,
    },
    destination: {
      type: String,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    returnDate: {
      type: Date,
    },
    travelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler is required'],
    },
    pickupLocation: {
      type: String,
    },
    driverRequired: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    bookingId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique booking ID before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const prefix = this.type === 'vehicle' ? 'VH' : 'PK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingId = `${prefix}${timestamp}${random}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
