import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Save as Waves, Heart, Share2, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { hotels } from '../data/hotels';

const amenityIcons: Record<string, React.ElementType> = {
  'Free WiFi': Wifi,
  'Parking': Car,
  'Restaurant': Coffee,
  'Gym': Dumbbell,
  'Pool': Waves,
  'Spa': Waves,
};

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const hotel = hotels.find(h => h.id === id);
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { success } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!hotel) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Hotel not found
          </h1>
          <Link to="/hotels">
            <button className="btn-primary">Back to Hotels</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(hotel.id)) {
      removeItem(hotel.id);
      success('Removed from wishlist');
    } else {
      addItem({
        id: hotel.id,
        type: 'hotel',
        data: hotel,
      });
      success('Added to wishlist');
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Luxury': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Deluxe': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Standard': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Budget': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const images = hotel.gallery.length > 0 ? [hotel.image, ...hotel.gallery] : [hotel.image];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Image Gallery */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <Link
          to="/hotels"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hotels
        </Link>

        {/* Image thumbnails */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-3 justify-center">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-white'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryLabel(hotel.category)}`}>
                      {hotel.category}
                    </span>
                    <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mt-3">
                      {hotel.name}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-surface-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {hotel.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {hotel.rating} ({hotel.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-3 rounded-xl transition-all ${
                        isInWishlist(hotel.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(hotel.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-primary-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-surface-600 dark:text-surface-400">{hotel.description}</p>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                        <Icon className="w-5 h-5 text-primary-500" />
                        <span className="text-surface-700 dark:text-surface-300">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-4">
                  Highlights
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.highlights.map((highlight, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium">
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary-500">
                    Rs {hotel.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-surface-500">/night</span>
                </div>
                {hotel.originalPrice && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg text-surface-400 line-through">
                      Rs {hotel.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Address</span>
                    <span className="text-surface-700 dark:text-surface-300">{hotel.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Category</span>
                    <span className="text-surface-700 dark:text-surface-300">{hotel.category}</span>
                  </div>
                </div>

                <Link to="/booking">
                  <button className="btn-primary w-full mb-3">Book Now</button>
                </Link>
                <button className="btn-outline w-full flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Hotel
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Need Help?</h3>
                <p className="text-sm text-surface-500 mb-4">
                  Our travel experts are here to help you plan your perfect stay.
                </p>
                <div className="space-y-2 text-sm">
                  <a href="tel:+916205584013" className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500">
                    <Phone className="w-4 h-4" />
                    +91 62055 84013
                  </a>
                  <a href="mailto:contact@pahadperchale.com" className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500">
                    <Mail className="w-4 h-4" />
                    contact@pahadperchale.com
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
