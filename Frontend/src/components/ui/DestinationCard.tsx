import { motion } from 'framer-motion';
import { MapPin, Star, Thermometer, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Destination } from '../../data/destinations';

interface DestinationCardProps {
  destination: Destination & { _id?: string };
  index?: number;
}

export default function DestinationCard({ destination, index = 0 }: DestinationCardProps) {
  const destId = destination.id || destination._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/destinations/${destId}`}>
        <div className="group glass-card overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300">
          <div className="relative h-64 overflow-hidden">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                {destination.state}
              </div>
              <h3 className="text-2xl font-display font-bold text-white">{destination.name}</h3>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">{destination.rating}</span>
            </div>
          </div>
          <div className="p-5">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {destination.shortDescription}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
      </Link>
    </motion.div>
  );
}
