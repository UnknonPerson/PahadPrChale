import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, Grid2x2 as Grid, List,
  MapPin, Star, Wifi, Car, Coffee, Dumbbell, Waves,
  AlertCircle, Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHotels } from '../hooks/useHotels';

const CATEGORIES = ['All', 'Budget', 'Standard', 'Deluxe', 'Luxury'];

const categoryColor: Record<string, string> = {
  Luxury:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Deluxe:   'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Standard: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Budget:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

function getCategoryColor(cat: string) {
  return categoryColor[cat] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
}

function HotelSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="h-52 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function Hotels() {
  const { hotels, loading, error } = useHotels();

  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [destination, setDestination] = useState('All');
  const [maxPrice, setMaxPrice]     = useState(20000);
  const [view, setView]             = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Safe: filter out hotels with no destination before building the list
  const destinations = [
    'All',
    ...Array.from(new Set(hotels.map((h) => h.destination).filter(Boolean))),
  ];

  const filtered = hotels.filter((h) => {
    const name = (h.name || '').toLowerCase();
    const dest = (h.destination || '').toLowerCase();
    const q    = search.toLowerCase();
    const price = h.pricePerNight ?? 0;
    return (
      (name.includes(q) || dest.includes(q)) &&
      (category === 'All' || h.category === category) &&
      (destination === 'All' || h.destination === destination) &&
      price <= maxPrice
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="relative h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Hotels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-white mb-3"
            >
              Find Your Perfect Stay
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-lg text-white/80"
            >
              Handpicked hotels across Northeast India
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search + filter bar — pulled up over hero */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 mb-8 -mt-14 relative z-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search hotels or destinations…"
                  className="input-field pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors sm:hidden ${
                  showFilters
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2.5 rounded-xl transition-colors ${view === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2.5 rounded-xl transition-colors ${view === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
                <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Destination</label>
                <select className="input-field" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  {destinations.map((d) => <option key={d} value={d}>{d === 'All' ? 'All Destinations' : d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Max price: ₹{maxPrice.toLocaleString('en-IN')} / night
                </label>
                <input
                  type="range" min={500} max={20000} step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 accent-primary-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> hotels
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => <HotelSkeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Building2 className="w-9 h-9 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {hotels.length === 0 ? 'No hotels available' : 'No hotels match your filters'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {hotels.length === 0 ? 'Check back soon for new listings.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          )}

          {/* Grid view */}
          {!loading && view === 'grid' && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((hotel, idx) => {
                const id = hotel._id || hotel.id;
                const amenities: string[] = Array.isArray(hotel.amenities) ? hotel.amenities : [];
                const price = hotel.pricePerNight ?? 0;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {hotel.image ? (
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {hotel.category && (
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(hotel.category)}`}>
                          {hotel.category}
                        </span>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{hotel.rating ?? '—'}</span>
                      </div>
                      {hotel.destination && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{hotel.destination}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-display font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors line-clamp-1">
                        {hotel.name}
                      </h3>
                      {hotel.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{hotel.description}</p>
                      )}

                      {/* Amenities */}
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {amenities.slice(0, 4).map((a, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {a}
                            </span>
                          ))}
                          {amenities.length > 4 && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                              +{amenities.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          <p className="text-xs text-gray-400">per night</p>
                          <p className="text-lg font-bold text-primary-500">
                            ₹{price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Link to={`/hotels/${id}`}>
                          <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* List view */}
          {!loading && view === 'list' && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((hotel, idx) => {
                const id = hotel._id || hotel.id;
                const amenities: string[] = Array.isArray(hotel.amenities) ? hotel.amenities : [];
                const price = hotel.pricePerNight ?? 0;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row gap-0">
                      <div className="sm:w-56 h-48 sm:h-auto flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        {hotel.image ? (
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            {hotel.category && (
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1.5 ${getCategoryColor(hotel.category)}`}>
                                {hotel.category}
                              </span>
                            )}
                            <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                              {hotel.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{hotel.rating ?? '—'}</span>
                            {hotel.reviewCount != null && (
                              <span className="text-xs text-gray-500">({hotel.reviewCount})</span>
                            )}
                          </div>
                        </div>
                        {hotel.destination && (
                          <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <MapPin className="w-3.5 h-3.5" />{hotel.address || hotel.destination}
                          </p>
                        )}
                        {hotel.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{hotel.description}</p>
                        )}
                        {amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {amenities.slice(0, 5).map((a, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div>
                            <p className="text-xs text-gray-400">Starting from</p>
                            <p className="text-xl font-bold text-primary-500">
                              ₹{price.toLocaleString('en-IN')}
                              <span className="text-xs font-normal text-gray-400"> /night</span>
                            </p>
                          </div>
                          <Link to={`/hotels/${id}`}>
                            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-colors">
                              Book Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Need Help Finding the Perfect Hotel?</h2>
          <p className="text-white/80 mb-7">Our travel experts can help you find the ideal accommodation for your Northeast India journey.</p>
          <Link to="/contact">
            <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
