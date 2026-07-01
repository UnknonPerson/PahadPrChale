import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'user_registered',
        'user_login',
        'user_logout',
        'profile_updated',
        'booking_created',
        'booking_cancelled',
        'booking_updated',
        'package_created',
        'package_updated',
        'package_deleted',
        'hotel_created',
        'hotel_updated',
        'hotel_deleted',
        'vehicle_created',
        'vehicle_updated',
        'vehicle_deleted',
        'destination_created',
        'destination_updated',
        'destination_deleted',
        'message_sent',
        'message_replied',
        'custom_tour_requested',
        'custom_tour_updated',
      ],
      required: [true, 'Activity type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    relatedModel: {
      type: String,
      enum: ['User', 'Booking', 'Package', 'Hotel', 'Vehicle', 'Destination', 'Message', 'Trip', 'CustomTourRequest'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ user: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
