import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, MapPin, Calendar, Building2, Bus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useState } from 'react';

const typeIcons = {
  package: Calendar,
  destination: MapPin,
  hotel: Building2,
  vehicle: Bus,
};

const typeColors = {
  package: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
  destination: 'text-secondary-500 bg-secondary-100 dark:bg-secondary-900/30',
  hotel: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
  vehicle: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30',
};

const typeLinks = {
  package: '/packages',
  destination: '/destinations',
  hotel: '/hotels',
  vehicle: '/vehicles',
};

export default function Wishlist() {
  const { items, removeItem, clearWishlist, itemCount } = useWishlist();
  const { success } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const handleRemove = (id: string, name: string) => {
    setRemovingItem(id);
    setTimeout(() => {
      removeItem(id);
      success(`Removed ${name} from wishlist`);
      setRemovingItem(null);
    }, 300);
  };

  const handleClearAll = () => {
    clearWishlist();
    success('Wishlist cleared');
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-surface-500 mt-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {itemCount > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item) => {
                const Icon = typeIcons[item.type];
                const data = item.data as Record<string, unknown>;
                const id = data.id || data._id || item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden group hover:shadow-xl transition-all ${
                      removingItem === item.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={(data.image as string) || 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={(data.name as string) || 'Item'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1 ${typeColors[item.type]}`}>
                          <Icon className="w-3 h-3" />
                          {item.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, (data.name as string) || 'item')}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-white mb-2">
                        {(data.name as string) || 'Unknown'}
                      </h3>

                      {data.destination && (
                        <p className="text-sm text-surface-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-4 h-4" />
                          {data.destination as string}
                        </p>
                      )}

                      {data.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 mb-4">
                          {data.description as string}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-800">
                        {data.pricePerNight && (
                          <p className="text-primary-500 font-semibold">
                            Rs {(data.pricePerNight as number).toLocaleString('en-IN')}/night
                          </p>
                        )}
                        {data.price && (
                          <p className="text-primary-500 font-semibold">
                            Rs {(data.price as number).toLocaleString('en-IN')}
                          </p>
                        )}
                        {data.pricePerDay && (
                          <p className="text-primary-500 font-semibold">
                            Rs {(data.pricePerDay as number).toLocaleString('en-IN')}/day
                          </p>
                        )}
                        <Link to={`${typeLinks[item.type]}/${id}`}>
                          <button className="btn-primary py-2 px-4 text-sm">
                            View Details
                          </button>
                        </Link>
                      </div>

                      <p className="text-xs text-surface-400 mt-4">
                        Added {new Date(item.addedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-16 h-16 text-surface-300 dark:text-surface-700" />
            </div>
            <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-surface-500 mb-8 max-w-md mx-auto">
              Start saving your favorite destinations, packages, hotels, and vehicles to access them later.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/destinations">
                <button className="btn-outline">Explore Destinations</button>
              </Link>
              <Link to="/packages">
                <button className="btn-secondary">View Packages</button>
              </Link>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearAll}
          title="Clear Wishlist"
          message="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
          confirmText="Clear All"
          variant="danger"
        />
      </div>
    </div>
  );
}
