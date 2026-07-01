import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Fuel, Settings, Shield, MapPin, Star, Phone, Mail, Check } from 'lucide-react';
import { useVehicle } from '../hooks/useVehicles';
import { PageLoader } from '../components/ui/LoadingSpinner';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { vehicle, loading, error } = useVehicle(id);

  // Helper functions for data mapping
  const getVehicleImage = () => vehicle?.image || vehicle?.images?.[0] || 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800';
  const getVehicleName = () => vehicle?.name || vehicle?.vehicleName || 'Vehicle';
  const getVehicleType = () => vehicle?.type || vehicle?.vehicleType || 'Sedan';

  if (loading) {
    return <PageLoader />;
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            {error ? 'Error loading vehicle' : 'Vehicle not found'}
          </h1>
          {error && (
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              {error}
            </p>
          )}
          <Link to="/vehicles">
            <button className="btn-primary">Back to Vehicles</button>
          </Link>
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SUV': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      case 'Sedan': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Tempo Traveller': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Minibus': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Motorcycle': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const vehicleType = getVehicleType();
  const vehicleName = getVehicleName();
  const vehicleImage = getVehicleImage();

  const destinations = vehicle.destinations || (vehicle.destination ? [vehicle.destination] : []);
  const features = vehicle.features || [];
  const bestFor = vehicle.bestFor || [];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={vehicleImage}
          alt={vehicleName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <Link
          to="/vehicles"
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vehicles
        </Link>

        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeLabel(vehicleType)}`}>
              {vehicleType}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-2">
              {vehicleName}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {vehicle.seats || 4} Seats
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {vehicle.rating || 4.0}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-4">
                  About This Vehicle
                </h2>
                <p className="text-surface-600 dark:text-surface-400">{vehicle.description || 'A comfortable and reliable vehicle for your journey through Northeast India.'}</p>
              </motion.div>

              {/* Features */}
              {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                      <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm text-surface-700 dark:text-surface-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              )}

              {/* Best For */}
              {bestFor.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-4">
                  Best For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {bestFor.map((item: string, index: number) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
              )}

              {/* Destination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-white mb-4">
                  Available At
                </h2>
                <div className="flex flex-wrap gap-2">
                  {destinations.map((dest: string, index: number) => (
                    <span key={index} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      {dest}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* Pricing Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-surface-500">Per Day</span>
                    <span className="text-2xl font-bold text-primary-500">
                      Rs {(vehicle.pricePerDay || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {vehicle.pricePerKm && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-surface-500">Per Km</span>
                      <span className="text-lg font-semibold text-surface-700 dark:text-surface-300">
                        Rs {vehicle.pricePerKm}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Vehicle Type</span>
                    <span className="text-surface-700 dark:text-surface-300">{vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Seating Capacity</span>
                    <span className="text-surface-700 dark:text-surface-300">{vehicle.seats || 4} passengers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Rating</span>
                    <span className="flex items-center gap-1 text-surface-700 dark:text-surface-300">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {vehicle.rating || 4.0}
                    </span>
                  </div>
                </div>

                <Link to={`/booking?type=vehicle&id=${vehicle.id || vehicle._id}`}>
                  <button className="btn-primary w-full mb-3">Book Now</button>
                </Link>
                <button className="btn-outline w-full flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Request Callback
                </button>
              </motion.div>

              {/* Why Choose Us */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Why Book With Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <span className="text-surface-600 dark:text-surface-400">All vehicles fully insured</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Settings className="w-5 h-5 text-primary-500" />
                    <span className="text-surface-600 dark:text-surface-400">Professional drivers</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Fuel className="w-5 h-5 text-primary-500" />
                    <span className="text-surface-600 dark:text-surface-400">Well-maintained fleet</span>
                  </li>
                </ul>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800"
              >
                <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Need Help?</h3>
                <p className="text-sm text-surface-500 mb-4">Our team is available 24/7 for assistance.</p>
                <div className="space-y-2 text-sm">
                  <a href="tel:+916205584013" className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500">
                    <Phone className="w-4 h-4" />
                    +91 62055 84013
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
