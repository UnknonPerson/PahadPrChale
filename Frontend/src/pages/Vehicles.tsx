import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Grid2x2 as Grid, List, MapPin, Users, Fuel, Star, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../hooks/useVehicles';
import { SkeletonCard } from '../components/ui/LoadingSpinner';

const vehicleTypes = ['All', 'Sedan', 'SUV', 'Tempo Traveller', 'Minibus', 'Motorcycle'];
const seatOptions = [
  { label: 'All', value: 0 },
  { label: '2-4 seats', value: 4 },
  { label: '5-7 seats', value: 7 },
  { label: '8+ seats', value: 8 },
];

export default function Vehicles() {
  const { vehicles, loading, error } = useVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [seatsFilter, setSeatsFilter] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const vehicleName = vehicle.name || vehicle.vehicleName || '';
    const vehicleType = vehicle.type || vehicle.vehicleType || '';
    const matchesSearch = vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicleType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || vehicleType === typeFilter;
    const matchesSeats = seatsFilter === 0 ||
                         (seatsFilter === 4 && vehicle.seats <= 4) ||
                         (seatsFilter === 7 && vehicle.seats > 4 && vehicle.seats <= 7) ||
                         (seatsFilter === 8 && vehicle.seats >= 8);
    const matchesPrice = vehicle.pricePerDay >= priceRange[0] && vehicle.pricePerDay <= priceRange[1];
    return matchesSearch && matchesType && matchesSeats && matchesPrice;
  });

  // Helper function to get vehicle image
  const getVehicleImage = (vehicle: any) => vehicle.image || vehicle.images?.[0] || 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg?auto=compress&cs=tinysrgb&w=800';
  const getVehicleName = (vehicle: any) => vehicle.name || vehicle.vehicleName || 'Unknown Vehicle';
  const getVehicleType = (vehicle: any) => vehicle.type || vehicle.vehicleType || 'Sedan';

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUV':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      case 'Sedan':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Tempo Traveller':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Minibus':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Motorcycle':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Hero Banner */}
      <section className="relative h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/116680/pexels-photo-116680.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Vehicles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              Vehicle Rentals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              Travel comfortably across Northeast India
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-800 p-6 mb-8 -mt-16 relative z-10">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  className="input-field pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                  showFilters
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop Filters */}
            <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    className="input-field"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Seats
                  </label>
                  <select
                    className="input-field"
                    value={seatsFilter}
                    onChange={(e) => setSeatsFilter(parseInt(e.target.value))}
                  >
                    {seatOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Price/Day: Rs {priceRange[0]} - Rs {priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="25000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-surface-600 dark:text-surface-400">
              Showing{' '}
              <span className="font-semibold text-surface-900 dark:text-white">
                {filteredVehicles.length}
              </span>{' '}
              vehicles
            </p>
          </div>

          {/* Vehicles Grid/List */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
              <p className="text-red-800 dark:text-red-200 font-medium">Error loading vehicles</p>
              <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}

          {loading ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredVehicles.map((vehicle, index) => {
                const vehicleId = vehicle.id || vehicle._id;
                const vehicleImage = getVehicleImage(vehicle);
                const vehicleName = getVehicleName(vehicle);
                const vehicleType = getVehicleType(vehicle);
                return (
                <motion.div
                  key={vehicleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={vehicleImage}
                      alt={vehicleName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(vehicleType)}`}>
                        {vehicleType}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{vehicle.seats} Seats</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{vehicle.rating || 4.0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                      {vehicleName}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 line-clamp-2">
                      {vehicle.description || 'Comfortable and reliable vehicle for your journey.'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(vehicle.features || []).slice(0, 3).map((feature: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-800">
                      <div>
                        <span className="text-sm text-surface-500">per day</span>
                        <p className="text-xl font-bold text-primary-500">
                          Rs {(vehicle.pricePerDay || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <Link to={`/vehicles/${vehicleId}`}>
                        <button className="btn-primary py-2 px-4 text-sm">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-surface-400" />
              </div>
              <p className="text-xl text-surface-500 mb-2">No vehicles found</p>
              <p className="text-surface-400">Try adjusting your filters</p>
            </div>
          )}

        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-white text-center mb-12">
            Why Choose Our Vehicles?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">Safe & Insured</h3>
              <p className="text-surface-600 dark:text-surface-400">All vehicles are well-maintained, insured, and driven by experienced local drivers.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">Well Maintained</h3>
              <p className="text-surface-600 dark:text-surface-400">Regular servicing ensures reliable performance on challenging mountain roads.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mb-4">
                <Fuel className="w-8 h-8 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">Fuel Efficient</h3>
              <p className="text-surface-600 dark:text-surface-400">Modern vehicles with great mileage help keep your travel costs affordable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-500 to-primary-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Need a Custom Vehicle Arrangement?
          </h2>
          <p className="text-white/80 mb-8">
            Planning a large group tour or need specific vehicle requirements? We can arrange custom transportation.
          </p>
          <Link to="/contact">
            <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-surface-50 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
