import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import DestinationCard from '../components/ui/DestinationCard';
import { SkeletonCard } from '../components/ui/LoadingSpinner';
import { useDestinations } from '../hooks/useDestinations';

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const { destinations, loading, error } = useDestinations();

  const states = ['All', ...new Set(destinations.map((d) => d.state))];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'All' || dest.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen pt-8">
      {/* Hero Banner */}
      <section className="relative h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Destinations"
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
              Explore Destinations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              Discover the hidden gems of Northeast India
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="input-field pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {states.map((state) => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedState === state
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredDestinations.length}
              </span>{' '}
              destinations
            </p>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-xl text-red-500 dark:text-red-400 mb-2">
                Error loading destinations
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {error}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDestinations.map((dest, index) => (
                  <DestinationCard key={dest.id} destination={dest} index={index} />
                ))}
              </div>

              {filteredDestinations.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    No destinations found.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            title="Can't Find Your Destination?"
            subtitle="We offer custom tours to any location in Northeast India. Let us craft your perfect itinerary."
          />
          <Link to="/contact">
            <button className="btn-primary mt-4">Request Custom Tour</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
