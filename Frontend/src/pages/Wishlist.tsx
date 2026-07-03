import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, MapPin, Calendar, Building2, Bus, X, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist, WishlistItem } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const TYPE_ICON: Record<string, React.ElementType> = {
  package:     Package,
  destination: MapPin,
  hotel:       Building2,
  vehicle:     Bus,
};

const TYPE_COLOR: Record<string, string> = {
  package:     'text-primary-500 bg-primary-50 dark:bg-primary-900/30',
  destination: 'text-secondary-500 bg-secondary-50 dark:bg-secondary-900/30',
  hotel:       'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  vehicle:     'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/30',
};

const TYPE_ROUTE: Record<string, string> = {
  package:     '/packages',
  destination: '/destinations',
  hotel:       '/hotels',
  vehicle:     '/vehicles',
};

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function Wishlist() {
  const { items, itemCount, removeItem, clearWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  // Require login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
            <Heart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Sign in to view wishlist</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Save your favourite packages, hotels, and more by signing in.</p>
          <button onClick={() => navigate('/login', { state: { from: { pathname: '/wishlist' } } })} className="btn-primary px-8 py-3">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleRemove = (item: WishlistItem) => {
    setRemoving(item.id);
    setTimeout(() => {
      removeItem(item.id);
      success(`Removed "${item.name}" from wishlist`);
      setRemoving(null);
    }, 250);
  };

  const handleClearAll = () => {
    clearWishlist();
    success('Wishlist cleared');
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {itemCount > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-200 dark:border-red-900/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-28 h-28 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Heart className="w-14 h-14 text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Tap the heart icon on any package, hotel, or destination to save it here.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/destinations"><button className="btn-outline">Explore Destinations</button></Link>
              <Link to="/packages"><button className="btn-primary">View Packages</button></Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item) => {
                const Icon = TYPE_ICON[item.type] ?? Package;
                const isRemoving = removing === item.id;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isRemoving ? 0.4 : 1, scale: isRemoving ? 0.95 : 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${TYPE_COLOR[item.type]}`}>
                          <Icon className="w-3 h-3" />
                          {item.type}
                        </span>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={isRemoving}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.destination && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.destination}</span>
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{item.description}</p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          {item.price != null && (
                            <p className="text-primary-500 font-bold text-sm">
                              ₹{item.price.toLocaleString('en-IN')}
                              {item.priceLabel && <span className="font-normal text-xs text-gray-400">{item.priceLabel}</span>}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(item.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <Link to={`${TYPE_ROUTE[item.type]}/${item.id}`}>
                          <button className="text-xs font-semibold text-primary-500 hover:text-primary-600 border border-primary-300 dark:border-primary-700 hover:border-primary-500 px-3 py-1.5 rounded-lg transition-colors">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear Wishlist"
        message="Remove all saved items? This cannot be undone."
        confirmText="Clear All"
        variant="danger"
      />
    </div>
  );
}
