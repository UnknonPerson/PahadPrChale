import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    state: { type: String, required: [true, 'State is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: 200 },

    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    gallery: [{ type: String }],
    galleryPublicIds: [{ type: String }],

    highlights: [{ type: String }],
    bestTime: { type: String },
    altitude: { type: String },
    temperature: { type: String },
    activities: [{ type: String }],
    startingPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

destinationSchema.index({ name: 'text', state: 'text', description: 'text' });
destinationSchema.index({ isActive: 1, state: 1 });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
