import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, IndianRupee, MapPin, Clock, CircleCheck as CheckCircle, Circle as XCircle, Eye, MessageSquare, ListFilter as Filter, RefreshCw, Car, Hop as Home, UtensilsCrossed } from 'lucide-react';
import { useAllCustomTours, useCustomTourStats, useCustomTourActions } from '../../hooks/useCustomTours';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const accommodationLabels: Record<string, string> = {
  budget: 'Budget',
  standard: 'Standard',
  premium: 'Premium',
  luxury: 'Luxury',
};

const transportLabels: Record<string, string> = {
  flight: 'Flight',
  train: 'Train',
  bus: 'Bus',
  car: 'Car',
  mixed: 'Mixed',
};

const mealLabels: Record<string, string> = {
  none: 'No Meals',
  breakfast: 'Breakfast Only',
  half_board: 'Half Board',
  full_board: 'Full Board',
};

export default function CustomTours() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotedPrice, setQuotedPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { requests, loading, error, refetch } = useAllCustomTours({
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });
  const { stats } = useCustomTourStats();
  const { updateStatus } = useCustomTourActions();

  const filteredRequests = requests.filter((req: any) =>
    req.requestId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.destinations?.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
    req.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setIsSubmitting(true);
      await updateStatus(id, { status });
      await refetch();
      if (selectedRequest?._id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuote = async () => {
    if (!selectedRequest || !quotedPrice) return;

    try {
      setIsSubmitting(true);
      await updateStatus(selectedRequest._id, {
        status: 'approved',
        quotedPrice: parseFloat(quotedPrice),
        adminNotes,
      });
      await refetch();
      setShowQuoteModal(false);
      setQuotedPrice('');
      setAdminNotes('');
      setSelectedRequest(null);
    } catch (err) {
      console.error('Failed to send quote:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Custom Tour Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage custom tour requests from customers
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-500">{stats?.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Under Review</p>
              <p className="text-xl font-bold text-blue-500">{stats?.underReview || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold text-green-500">{stats?.approved || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-red-500">{stats?.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, destination, or user..."
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
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Requests Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No custom tour requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Destinations</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Travelers</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Budget</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request: any, index: number) => (
                  <motion.tr
                    key={request._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-primary-500">{request.requestId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{request.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{request.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {request.destinations?.slice(0, 2).join(', ')}
                          {request.destinations?.length > 2 && ` +${request.destinations.length - 2} more`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <div>{formatDate(request.startDate)}</div>
                        <div className="text-xs text-gray-500">to {formatDate(request.endDate)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {request.adults} adult{request.adults > 1 ? 's' : ''}
                          {request.children > 0 && `, ${request.children} child${request.children > 1 ? 'ren' : ''}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-secondary-500">
                          {request.budget?.toLocaleString('en-IN')}
                          <span className="text-xs text-gray-500 ml-1">
                            {request.budgetType === 'per_person' ? '/person' : 'total'}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                        {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                      </span>
                      {request.quotedPrice && (
                        <p className="text-xs text-green-600 mt-1">
                          Quoted: {request.quotedPrice.toLocaleString('en-IN')}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-primary-500"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'under_review')}
                            className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 hover:text-blue-500"
                            title="Mark Under Review"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        {['pending', 'under_review'].includes(request.status) && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowQuoteModal(true);
                              }}
                              className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-500 hover:text-green-500"
                              title="Approve with Quote"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'rejected')}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'completed')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-green-500"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRequest && !showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl my-8"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Request Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">ID: {selectedRequest.requestId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedRequest.status]}`}>
                  {selectedRequest.status.replace('_', ' ').charAt(0).toUpperCase() + selectedRequest.status.replace('_', ' ').slice(1)}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* User Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-3">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.user?.name}</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Trip Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="glass-card p-3">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedRequest.startDate)}</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedRequest.endDate)}</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium text-secondary-500">
                      {selectedRequest.budget?.toLocaleString('en-IN')} {selectedRequest.budgetType === 'per_person' ? '/person' : 'total'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Destinations */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.destinations?.map((dest: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm">
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Preferences</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="glass-card p-3 flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Accommodation</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {accommodationLabels[selectedRequest.accommodationType] || selectedRequest.accommodationType}
                      </p>
                    </div>
                  </div>
                  <div className="glass-card p-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Transport</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transportLabels[selectedRequest.transportation] || selectedRequest.transportation}
                      </p>
                    </div>
                  </div>
                  <div className="glass-card p-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Meals</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {mealLabels[selectedRequest.meals] || selectedRequest.meals}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedRequest.specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Special Requests</h3>
                  <div className="glass-card p-4">
                    <p className="text-gray-700 dark:text-gray-300">{selectedRequest.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedRequest.adminNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
                  <div className="glass-card p-4 bg-primary-50 dark:bg-primary-900/20">
                    <p className="text-gray-700 dark:text-gray-300">{selectedRequest.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Send Price Quote
              </h2>
              <p className="text-sm text-gray-500 mt-1">Request ID: {selectedRequest.requestId}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quoted Price (INR) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    className="input-field pl-10"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="Enter quoted price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Notes (Optional)
                </label>
                <textarea
                  className="input-field h-24 resize-none"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Any additional notes for the customer..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setQuotedPrice('');
                  setAdminNotes('');
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuote}
                disabled={isSubmitting || !quotedPrice}
                className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Approve & Send Quote'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
