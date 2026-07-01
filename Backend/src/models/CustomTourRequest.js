import mongoose from 'mongoose';

const customTourRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    destinations: [{
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    }],
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
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    budgetType: {
      type: String,
      enum: ['per_person', 'total'],
      default: 'per_person',
    },
    accommodationType: {
      type: String,
      enum: ['budget', 'standard', 'premium', 'luxury'],
      default: 'standard',
    },
    transportation: {
      type: String,
      enum: ['flight', 'train', 'bus', 'car', 'mixed'],
      default: 'car',
    },
    meals: {
      type: String,
      enum: ['none', 'breakfast', 'half_board', 'full_board'],
      default: 'breakfast',
    },
    activities: [{
      type: String,
      trim: true,
    }],
    pickupLocation: {
      type: String,
      trim: true,
      default: '',
    },
    specialRequests: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    quotedPrice: {
      type: Number,
      min: [0, 'Quoted price cannot be negative'],
    },
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    requestId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique request ID before saving
customTourRequestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.requestId = `CTR-${timestamp}-${random}`;
  }
  next();
});

// Indexes
customTourRequestSchema.index({ user: 1, createdAt: -1 });
customTourRequestSchema.index({ status: 1 });
customTourRequestSchema.index({ requestId: 1 });

const CustomTourRequest = mongoose.model('CustomTourRequest', customTourRequestSchema);

export default CustomTourRequest;
