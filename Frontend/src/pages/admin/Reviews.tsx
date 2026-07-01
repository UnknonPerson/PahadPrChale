import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Star, Check, X, Trash2, MessageSquare, RefreshCw } from 'lucide-react';
import { useAllReviews, useReviewStats } from '../../hooks/useReviews';
import { useReviewActions } from '../../hooks/useReviews';

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { reviews, loading, error, refetch } = useAllReviews({
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });
  const { stats, loading: statsLoading } = useReviewStats();
  const { updateStatus, remove } = useReviewActions();

  const filteredReviews = reviews.filter((review: any) => {
    const matchesSearch =
      (review.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.package?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.comment || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      await updateStatus(reviewId, newStatus);
      await refetch();
    } catch (err) {
      console.error('Failed to update review status:', err);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await remove(reviewId);
        await refetch();
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
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
            Reviews
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage verified package reviews from customers
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {statsLoading ? '...' : stats?.averageRating?.toFixed(1) || '0'}
            </span>
            <span className="text-sm text-gray-500">avg rating</span>
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {statsLoading ? '...' : stats?.totalReviews || 0}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-xl font-bold text-green-500">
            {reviews.filter((r: any) => r.status === 'approved').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-500">
            {reviews.filter((r: any) => r.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && filteredReviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No reviews found</p>
          <p className="text-sm mt-2">Reviews will appear here when customers submit them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review: any, index: number) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&background=random`}
                  alt={review.user?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {review.title || `Review for ${review.package?.name || 'Package'}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {review.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="text-sm text-gray-500">
                          {review.package?.name || 'Unknown Package'}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                        {review.isVerified && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Verified Booking
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>

                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review._id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 text-sm"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(review._id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(review._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm ml-auto"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
