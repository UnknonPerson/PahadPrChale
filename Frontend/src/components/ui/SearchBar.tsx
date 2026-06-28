import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
}

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState('2');

  if (variant === 'compact') {
    return (
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-500" />
          <input
            type="text"
            placeholder="Where to?"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-white placeholder-gray-400"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button className="btn-primary py-2 px-4">
          <Search className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Destination
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="input-field pl-10 appearance-none cursor-pointer"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Select destination</option>
              <option value="darjeeling">Darjeeling</option>
              <option value="gangtok">Gangtok</option>
              <option value="north-sikkim">North Sikkim</option>
              <option value="pelling">Pelling</option>
              <option value="shillong">Shillong</option>
              <option value="kaziranga">Kaziranga</option>
              <option value="tawang">Tawang</option>
              <option value="kalimpong">Kalimpong</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Travel Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="input-field pl-10"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Travelers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="input-field pl-10 appearance-none cursor-pointer"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            >
              <option value="1">1 Traveler</option>
              <option value="2">2 Travelers</option>
              <option value="3">3 Travelers</option>
              <option value="4">4 Travelers</option>
              <option value="5">5+ Travelers</option>
            </select>
          </div>
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
