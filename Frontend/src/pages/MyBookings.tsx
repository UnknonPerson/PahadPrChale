import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Phone, Mail, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageLoader } from '../components/ui/LoadingSpinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useMyBookings } from '../hooks/useBookings';
import { useBookingActions } from '../hooks/useBookings';

interface Booking {
  _id: string;
  package: {
    _id: string;
    name: string;
    image: string;
    duration: string;
  };
  packageName: string;
  destination: string;
  travelDate: string;
  travelers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}


export default function MyBookings() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { bookings, loading, error: loadingError, refetch } = useMyBookings();
  const { cancel } = useBookingActions();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'pending' | 'completed' | 'cancelled'>('all');
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['pending', 'confirmed'].includes(booking.status) && new Date(booking.travelDate) >= new Date();
    return booking.status === filter;
  });

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;
    try {
      await cancel(cancelBookingId);
      success('Booking cancelled successfully');
      refetch();
    } catch (err) {
      error('Failed to cancel booking');
    } finally {
      setCancelBookingId(null);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (loadingError) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
              Error loading bookings
            </h2>
            <p className="text-surface-500 mb-8 max-w-md mx-auto">
              {loadingError}
            </p>
            <button onClick={refetch} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">
            My Bookings
          </h1>
          <p className="text-surface-500 mt-2">
            Track and manage your tour bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`p-4 rounded-xl border transition-all ${
                filter === status
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-300'
              }`}
            >
              <p className="text-2xl font-bold">
                {status === 'all' ? bookings.length : filteredBookings.length}
              </p>
              <p className="text-sm capitalize">{status}</p>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={booking.package?.image}
                      alt={booking.packageName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-white">
                          {booking.packageName}
                        </h3>
                        <p className="text-surface-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {booking.destination}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-surface-500">Booking ID</p>
                        <p className="font-medium text-surface-900 dark:text-white">#{booking._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Travel Date</p>
                        <p className="font-medium text-surface-900 dark:text-white flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Travelers</p>
                        <p className="font-medium text-surface-900 dark:text-white flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {booking.travelers}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Total Amount</p>
                        <p className="font-bold text-lg text-primary-500">
                          Rs {booking.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-800">
                      <p className="text-sm text-surface-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <div className="flex items-center gap-3">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => setCancelBookingId(booking._id)}
                            className="px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <Link to={`/bookings/${booking._id}`}>
                          <button className="btn-primary py-2 px-4 text-sm">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-16 h-16 text-surface-300 dark:text-surface-700" />
            </div>
            <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
              No bookings found
            </h2>
            <p className="text-surface-500 mb-8 max-w-md mx-auto">
              You haven't made any bookings yet. Explore our packages and start your journey today!
            </p>
            <Link to="/packages">
              <button className="btn-primary">Explore Packages</button>
            </Link>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!cancelBookingId}
          onClose={() => setCancelBookingId(null)}
          onConfirm={handleCancelBooking}
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone and refund policies will apply."
          confirmText="Cancel Booking"
          variant="danger"
        />
      </div>
    </div>
  );
}
