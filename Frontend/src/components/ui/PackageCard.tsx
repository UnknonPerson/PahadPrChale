import { motion } from 'framer-motion';
import { Clock, Users, Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Package } from '../../data/packages';
import { useWishlistToggle } from '../../hooks/useWishlist';

interface PackageCardProps {
  pkg: Package & { _id?: string; image?: string };
  index?: number;
}

export default function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  const id = String(pkg._id || pkg.id || '');
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : null;

  const { isWishlisted, toggle } = useWishlistToggle({
    id,
    type: 'package',
    name: pkg.name,
    image: pkg.image,
    price: pkg.price,
    destination: pkg.destination,
    description: pkg.description,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.4) }}
      className="group"
    >
      <div className="glass-card overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300">
        <div className="relative h-52 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}

          {/* Category + Wishlist */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400">
              {pkg.category}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); toggle(); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-500 hover:text-red-500'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{pkg.destination}</span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-primary-500 transition-colors line-clamp-1">
            {pkg.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(pkg.rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({pkg.reviewCount ?? 0})
            </span>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
            {pkg.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{pkg.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />Max {pkg.maxGroup}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
            <div>
              <p className="text-xs text-gray-400">From</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-secondary-500">
                  ₹{pkg.price.toLocaleString('en-IN')}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <Link to={`/packages/${id}`}>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors group/btn">
                View
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
