import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Eye, Check, X, Trash2, CalendarCheck, Loader, RefreshCw } from 'lucide-react';
import { useAllBookings, useBookingActions } from '../../hooks/useBookings';
import ExportButton from '../../components/ui/ExportButton';
import type { Booking } from '../../data/adminData';
import { useToast } from '../../context/ToastContext';

const statusFilters = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function Bookings() {
  const { bookings: apiBookings, loading, error, refetch } = useAllBookings();
  const { updateStatus, cancel, remove } = useBookingActions();
  const { success, error: toastError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredBookings = apiBookings.filter((booking: Booking) => {
    const bookingId = booking.bookingId || booking._id || booking.id || '';
    const bookingName = booking.type === 'vehicle'
      ? (booking.vehicleName || booking.vehicle?.vehicleName || booking.vehicle?.name || '')
      : (booking.packageName || booking.package?.name || '');
    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookingName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = apiBookings.filter((b: Booking) => b.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleAccept = async (bookingId: string) => {
    setActionLoading(bookingId + '-accept');
    try {
      await updateStatus(bookingId, 'confirmed');
      success('Booking confirmed successfully');
      await refetch();
      if (selectedBooking && (selectedBooking.bookingId || selectedBooking._id || selectedBooking.id) === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: 'confirmed' });
      }
    } catch (err) {
      toastError('Failed to confirm booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setActionLoading(bookingId + '-cancel');
    try {
      await cancel(bookingId);
      success('Booking cancelled');
      await refetch();
      if (selectedBooking && (selectedBooking.bookingId || selectedBooking._id || selectedBooking.id) === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: 'cancelled' });
      }
    } catch (err) {
      toastError('Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Delete this booking permanently?')) return;
    setActionLoading(bookingId + '-delete');
    try {
      await remove(bookingId);
      success('Booking deleted');
      setSelectedBooking(null);
      await refetch();
    } catch (err) {
      toastError('Failed to delete booking');
    } finally {
      setActionLoading(null);
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
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mr-2">
                {pendingCount} pending
              </span>
            )}
            Manage and track all tour bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <ExportButton type="bookings" data={apiBookings} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status === statusFilter ? 'All' : status)}
            className={`glass-card p-4 text-left transition-all ${statusFilter === status ? 'ring-2 ring-primary-500' : ''}`}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {apiBookings.filter((b: Booking) => b.status === status).length}
            </p>
            <p className="text-sm capitalize text-gray-500">{status}</p>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-primary-500 mr-2" />
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-700 dark:text-red-400">Error: {error}</p>
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
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Package / Vehicle</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking: Booking, index: number) => {
                const bookingIdDisplay = booking.bookingId || booking._id || booking.id || '';
                const bookingRowKey = booking._id || booking.id || booking.bookingId || index;
                const bookingName = booking.type === 'vehicle'
                  ? (booking.vehicleName || booking.vehicle?.vehicleName || booking.vehicle?.name || 'Vehicle Booking')
                  : (booking.packageName || booking.package?.name || 'Package Booking');
                const travelDate = booking.travelDate || '';

                return (
                  <motion.tr
                    key={String(bookingRowKey)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-primary-500" />
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                          {bookingIdDisplay.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 dark:text-white">{bookingName}</p>
                      <p className="text-xs text-gray-400 capitalize">{booking.type || 'package'}</p>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300 text-sm">
                      {travelDate ? new Date(travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(bookingIdDisplay)}
                              disabled={actionLoading === bookingIdDisplay + '-accept'}
                              className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
                              title="Accept booking"
                            >
                              {actionLoading === bookingIdDisplay + '-accept'
                                ? <Loader className="w-4 h-4 animate-spin" />
                                : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleCancel(bookingIdDisplay)}
                              disabled={actionLoading === bookingIdDisplay + '-cancel'}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Cancel booking"
                            >
                              {actionLoading === bookingIdDisplay + '-cancel'
                                ? <Loader className="w-4 h-4 animate-spin" />
                                : <X className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(bookingIdDisplay)}
                          disabled={actionLoading === bookingIdDisplay + '-delete'}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete booking"
                        >
                          {actionLoading === bookingIdDisplay + '-delete'
                            ? <Loader className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && filteredBookings.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No bookings found</p>
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
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white">
                    {selectedBooking.bookingId || selectedBooking._id || selectedBooking.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 dark:text-white text-sm">{selectedBooking.customerEmail}</p>
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
                  <p className="text-sm text-gray-500">Package / Vehicle</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedBooking.type === 'vehicle'
                      ? (selectedBooking.vehicleName || selectedBooking.vehicle?.vehicleName || 'Vehicle')
                      : (selectedBooking.packageName || selectedBooking.package?.name || 'Package')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg text-secondary-500">
                    ₹{(selectedBooking.totalAmount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                {selectedBooking.specialRequests && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Special Requests</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAccept(selectedBooking.bookingId || selectedBooking._id || selectedBooking.id || '')}
                    disabled={!!actionLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading?.includes('-accept') ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => handleCancel(selectedBooking.bookingId || selectedBooking._id || selectedBooking.id || '')}
                    disabled={!!actionLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading?.includes('-cancel') ? <Loader className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(selectedBooking.bookingId || selectedBooking._id || selectedBooking.id || '')}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
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
