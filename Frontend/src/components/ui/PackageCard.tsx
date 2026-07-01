import { motion } from 'framer-motion';
import { Clock, Users, Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Package } from '../../data/packages';

interface PackageCardProps {
  pkg: Package & { _id?: string };
  index?: number;
}

export default function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-primary-600">{pkg.category}</span>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{pkg.destination}</span>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
            {pkg.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(pkg.rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              ({pkg.reviewCount} reviews)
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {pkg.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Max {pkg.maxGroup}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">From</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-secondary-500">
                &#8377;{pkg.price.toLocaleString('en-IN')}
                </span>
                {pkg.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    &#8377;{pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <Link to={`/packages/${pkg.id || pkg._id}`}>
              <button className="flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors group/btn">
                View Details
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
