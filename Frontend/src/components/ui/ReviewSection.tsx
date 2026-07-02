import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, Trash2, Loader, Lock } from 'lucide-react';
import { usePackageReviews, useReviewActions } from '../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ReviewSectionProps {
  packageId: string;
}

function StarRating({ value, onChange, readOnly = false }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= (hover || value) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ packageId }: ReviewSectionProps) {
  const { reviews, loading, refetch } = usePackageReviews(packageId);
  const { create, remove } = useReviewActions();
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const avgRating = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) { toastError('Please write a review'); return; }
    if (!bookingIdInput.trim()) { toastError('Please enter your booking ID'); return; }
    setSubmitting(true);
    try {
      await create({ bookingId: bookingIdInput, rating, comment, title });
      success('Review submitted!');
      setComment('');
      setTitle('');
      setBookingIdInput('');
      setRating(5);
      setShowForm(false);
      refetch();
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Only confirmed/completed bookings can be reviewed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete your review?')) return;
    try {
      await remove(reviewId);
      success('Review deleted');
      refetch();
    } catch {
      toastError('Failed to delete review');
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(avgRating)} readOnly />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {avgRating.toFixed(1)} / 5 ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </button>
        )}
        {!isAuthenticated && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            Login to review
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booking ID *</label>
                <input
                  type="text"
                  value={bookingIdInput}
                  onChange={(e) => setBookingIdInput(e.target.value)}
                  className="input-field"
                  placeholder="Find it in My Bookings page"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Only confirmed/completed bookings can be reviewed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating *</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review *</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field h-24 resize-none"
                  placeholder="Tell others about your experience..."
                  required
                  minLength={10}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 mt-1">{comment.length}/1000</p>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors">
                  {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Review
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 skeleton rounded" />
                <div className="h-3 w-full skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review: any) => (
            <div key={review._id} className="pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-start gap-4">
                <img
                  src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=10B981&color=fff`}
                  alt={review.user?.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating value={review.rating} readOnly />
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {review.isVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">Verified</span>
                        )}
                      </div>
                    </div>
                    {user && (user.id === review.user?._id || (user as any).role === 'admin') && (
                      <button onClick={() => handleDelete(review._id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {review.title && <p className="font-medium text-gray-800 dark:text-gray-200 mt-2">{review.title}</p>}
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
