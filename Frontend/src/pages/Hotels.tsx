import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Grid2x2 as Grid, List, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Save as Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import { hotels } from '../data/hotels';

const categories = ['All', 'Budget', 'Standard', 'Deluxe', 'Luxury'];
const amenities = [
  { name: 'Free WiFi', icon: Wifi },
  { name: 'Parking', icon: Car },
  { name: 'Restaurant', icon: Coffee },
  { name: 'Gym', icon: Dumbbell },
  { name: 'Pool', icon: Waves },
];

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const destinations = ['All', ...new Set(hotels.map(h => h.destination))];

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || hotel.category === categoryFilter;
    const matchesDestination = destinationFilter === 'All' || hotel.destination === destinationFilter;
    const matchesPrice = hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1];
    return matchesSearch && matchesCategory && matchesDestination && matchesPrice;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Luxury':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Deluxe':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Standard':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Budget':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Hero Banner */}
      <section className="relative h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Hotels"
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
              Find Your Perfect Stay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              Handpicked hotels across Northeast India
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
                  placeholder="Search hotels..."
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
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Destination
                  </label>
                  <select
                    className="input-field"
                    value={destinationFilter}
                    onChange={(e) => setDestinationFilter(e.target.value)}
                  >
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest === 'All' ? 'All Destinations' : dest}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Price Range: Rs {priceRange[0]} - Rs {priceRange[1]}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-surface-600 dark:text-surface-400">
              Showing{' '}
              <span className="font-semibold text-surface-900 dark:text-white">
                {filteredHotels.length}
              </span>{' '}
              hotels
            </p>
            {destinationFilter !== 'All' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-surface-500">Filtering by:</span>
                <span className="badge-primary">{destinationFilter}</span>
              </div>
            )}
          </div>

          {/* Hotels Grid/List */}
          {filteredHotels.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-xl transition-all'
                      : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-xl transition-all">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(hotel.category)}`}>
                            {hotel.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-surface-900 dark:text-white">{hotel.rating}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">{hotel.destination}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 line-clamp-2">
                          {hotel.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 4).map((amenity, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                              +{hotel.amenities.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-800">
                          <div>
                            <span className="text-sm text-surface-500">per night</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-primary-500">
                                Rs {hotel.pricePerNight.toLocaleString('en-IN')}
                              </span>
                              {hotel.originalPrice && (
                                <span className="text-sm text-surface-400 line-through">
                                  Rs {hotel.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link to={`/hotels/${hotel.id}`}>
                            <button className="btn-primary py-2 px-4 text-sm">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(hotel.category)}`}>
                              {hotel.category}
                            </span>
                            <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-white mt-2">
                              {hotel.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{hotel.rating}</span>
                            <span className="text-sm text-surface-500">({hotel.reviewCount})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-surface-500 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.address}</span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 mb-4">{hotel.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 5).map((amenity, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-surface-500">Starting from</span>
                            <p className="text-2xl font-bold text-primary-500">
                              Rs {hotel.pricePerNight.toLocaleString('en-IN')}
                              <span className="text-sm font-normal text-surface-500">/night</span>
                            </p>
                          </div>
                          <Link to={`/hotels/${hotel.id}`}>
                            <button className="btn-primary py-2 px-6">Book Now</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-surface-400" />
              </div>
              <p className="text-xl text-surface-500 mb-2">No hotels found</p>
              <p className="text-surface-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Need Help Finding the Perfect Hotel?
          </h2>
          <p className="text-white/80 mb-8">
            Our travel experts can help you find the ideal accommodation for your Northeast India journey.
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
