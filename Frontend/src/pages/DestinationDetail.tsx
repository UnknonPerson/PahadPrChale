import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Thermometer,
  Mountain,
  Star,
  Calendar,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useDestination } from '../hooks/useDestinations';
import { packages } from '../data/packages';
import { PageLoader, SkeletonCard } from '../components/ui/LoadingSpinner';
import PackageCard from '../components/ui/PackageCard';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const { destination, loading, error } = useDestination(id);
  const relatedPackages = packages.filter(
    (p) => p.destination.toLowerCase().includes(destination?.name?.toLowerCase() || '')
  );

  if (loading) {
    return <PageLoader />;
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error ? 'Error loading destination' : 'Destination not found'}
          </h1>
          {error && <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>}
          <Link to="/destinations">
            <Button variant="primary">Back to Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Destinations
            </Link>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin className="w-4 h-4" />
              {destination.state}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
              {destination.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-white">{destination.rating}</span>
                <span>({destination.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Mountain className="w-4 h-4" />
                <span>{destination.altitude}</span>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="w-4 h-4" />
                <span>{destination.temperature}</span>
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
                  About {destination.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {destination.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary-500" />
                      </div>
                      {highlight}
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
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {destination.gallery.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`${destination.name} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Travel Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Best Time to Visit
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {destination.bestTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mountain className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Altitude</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {destination.altitude}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Thermometer className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Temperature Range
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {destination.temperature}
                      </p>
                    </div>
                  </div>
                </div>
                <Link to="/booking">
                  <Button variant="primary" className="w-full mt-6">
                    Plan Your Trip
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Facts
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">State</span>
                    <span className="text-gray-900 dark:text-white">{destination.state}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Rating</span>
                    <span className="text-gray-900 dark:text-white flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {destination.rating}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reviews</span>
                    <span className="text-gray-900 dark:text-white">
                      {destination.reviewCount}
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
              Tour Packages for {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.slice(0, 3).map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
