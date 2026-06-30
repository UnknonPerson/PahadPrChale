import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { usePackage } from '../hooks/usePackages';

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const { pkg, loading, error } = usePackage(id!);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error ? `Error: ${error}` : 'Package not found'}
          </h1>
          <Link to="/packages">
            <Button variant="primary">Back to Packages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen pt-8">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Packages
            </Link>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin className="w-4 h-4" />
              {pkg.destination}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {pkg.duration}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Max {pkg.maxGroup} travelers
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-white">{pkg.rating}</span>
                <span>({pkg.reviewCount} reviews)</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/20 text-sm">
                {pkg.difficulty}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  About This Package
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pkg.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  Tour Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-primary-500" />
                      </div>
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  Detailed Itinerary
                </h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="relative pl-8 border-l-2 border-primary-200 dark:border-primary-800"
                    >
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Day {day.day}: {day.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    What's Not Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.excludes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-secondary-500">
                    &#8377;{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">per person</span>
                </div>
                {pkg.originalPrice && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg text-gray-400 line-through">
                      &#8377;{pkg.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                      {discount}% OFF
                    </span>
                  </div>
                )}

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="text-gray-900 dark:text-white">{pkg.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Max Group Size</span>
                    <span className="text-gray-900 dark:text-white">{pkg.maxGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <span className="text-gray-900 dark:text-white">{pkg.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                    <span className="text-gray-900 dark:text-white">{pkg.difficulty}</span>
                  </div>
                </div>

                <Link to="/booking">
                  <Button variant="primary" className="w-full mb-3">
                    Book Now
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Request Callback
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Have questions about this tour? Our travel experts are here to help.
                </p>
                <Button variant="ghost" className="w-full">
                  Chat with Us
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
