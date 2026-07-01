import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package is required'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    isVerified: {
      type: Boolean,
      default: true, // All reviews are from verified bookings
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Auto-approve since only booked users can review
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ package: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

// Pre-find middleware to populate user info
reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'name profileImage');
  next();
});

// Static method to calculate package rating
reviewSchema.statics.calculatePackageRating = async function (packageId) {
  const stats = await this.aggregate([
    {
      $match: { package: packageId, status: 'approved' },
    },
    {
      $group: {
        _id: '$package',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const Package = mongoose.model('Package');
    await Package.findByIdAndUpdate(packageId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    const Package = mongoose.model('Package');
    await Package.findByIdAndUpdate(packageId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// Post-save middleware to update package rating
reviewSchema.post('save', function () {
  this.constructor.calculatePackageRating(this.package);
});

// Post-remove middleware to update package rating
reviewSchema.post('deleteOne', function () {
  this.constructor.calculatePackageRating(this.package);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
