import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Eye, Check, X, Trash2, CalendarCheck, Download } from 'lucide-react';
import { useAllBookings, useBookingActions } from '../../hooks/useBookings';
import type { Booking } from '../../data/adminData';

const statusFilters = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function Bookings() {
  const { bookings: apiBookings, loading, error, refetch } = useAllBookings();
  const { cancel, remove } = useBookingActions();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingsList, setBookingsList] = useState<Booking[]>(apiBookings);

  // Update bookingsList when API data changes
  useEffect(() => {
    setBookingsList(apiBookings);
  }, [apiBookings]);

  const filteredBookings = bookingsList.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      // Optimistic update
      setBookingsList((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }

      // Call API to update status
      if (newStatus === 'cancelled') {
        await cancel(bookingId);
      }

      // Refetch to ensure consistency
      await refetch();
    } catch (err) {
      console.error('Failed to update booking status:', err);
      // Revert on error
      await refetch();
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        // Optimistic update
        setBookingsList((prev) => prev.filter((b) => b.id !== bookingId));
        setSelectedBooking(null);

        // Call API to delete
        await remove(bookingId);

        // Refetch to ensure consistency
        await refetch();
      } catch (err) {
        console.error('Failed to delete booking:', err);
        // Revert on error
        await refetch();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Bookings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all tour bookings
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="glass-card p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      )}

      {error && (
        <div className="glass-card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-700 dark:text-red-400">
            Error loading bookings: {error}. Showing fallback data.
          </p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, or package..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel Date
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travelers
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{booking.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900 dark:text-white">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900 dark:text-white">{booking.packageName}</p>
                    <p className="text-sm text-gray-500">{booking.destination}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                    {new Date(booking.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                    {booking.travelers}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{booking.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No bookings found
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Booking Details
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travelers</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.travelers}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.packageName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedBooking.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg text-secondary-500">
                    ₹{selectedBooking.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(selectedBooking.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
