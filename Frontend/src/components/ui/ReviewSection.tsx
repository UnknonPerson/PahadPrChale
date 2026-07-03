import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, Trash2, Loader, Lock, ChevronDown, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePackageReviews, useReviewActions } from '../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import bookingService from '../../services/bookingService';

interface ReviewSectionProps {
  packageId: string;
}

function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
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
          className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= (hover || value)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ packageId }: ReviewSectionProps) {
  const { reviews, loading, refetch } = usePackageReviews(packageId);
  const { create, remove, canReview } = useReviewActions();
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  // Review form state
  const [showForm, setShowForm]       = useState(false);
  const [rating, setRating]           = useState(5);
  const [comment, setComment]         = useState('');
  const [title, setTitle]             = useState('');
  const [submitting, setSubmitting]   = useState(false);

  // Eligible bookings for this package
  const [eligibleBookings, setEligibleBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [loadingBookings, setLoadingBookings]     = useState(false);
  const [eligibilityMsg, setEligibilityMsg]       = useState('');

  // Load user's bookings when form opens
  useEffect(() => {
    if (!showForm || !isAuthenticated) return;
    setLoadingBookings(true);
    setEligibilityMsg('');
    bookingService.getMy()
      .then((res: any) => {
        const all: any[] = res?.bookings ?? res?.data?.bookings ?? res?.data ?? res ?? [];
        // Only confirmed/completed bookings for this package
        const eligible = all.filter((b: any) => {
          const bPkgId = b.package?._id || b.package?.id || b.packageId || b.package;
          return (
            ['confirmed', 'completed'].includes(b.status) &&
            String(bPkgId) === String(packageId)
          );
        });
        setEligibleBookings(eligible);
        if (eligible.length === 0) {
          setEligibilityMsg(
            'You need a confirmed or completed booking for this package to leave a review.'
          );
        } else {
          setSelectedBookingId(eligible[0]._id || eligible[0].id || '');
        }
      })
      .catch(() => {
        setEligibilityMsg('Could not load your bookings. Please try again.');
      })
      .finally(() => setLoadingBookings(false));
  }, [showForm, isAuthenticated, packageId]);

  const avgRating = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 10) {
      toastError('Review must be at least 10 characters.');
      return;
    }
    if (!selectedBookingId) {
      toastError('Please select a booking to review.');
      return;
    }
    setSubmitting(true);
    try {
      // Verify eligibility first
      const check = await canReview(selectedBookingId);
      if (!check?.canReview) {
        toastError(check?.reason || 'You cannot review this booking.');
        setSubmitting(false);
        return;
      }

      await create({ bookingId: selectedBookingId, rating, comment: comment.trim(), title: title.trim() });
      success('Review submitted! It will appear after approval.');
      setComment('');
      setTitle('');
      setRating(5);
      setShowForm(false);
      refetch();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit review. Please try again.';
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Delete your review? This cannot be undone.')) return;
    try {
      await remove(reviewId);
      success('Review deleted.');
      refetch();
    } catch {
      toastError('Failed to delete review.');
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(avgRating)} readOnly />
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {avgRating.toFixed(1)} / 5 &bull; {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </button>
        )}

        {!isAuthenticated && (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-400 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Login to review
          </Link>
        )}
      </div>

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">Your Review</h3>

              {/* Booking selector */}
              {loadingBookings ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading your bookings…
                </div>
              ) : eligibilityMsg ? (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-300">{eligibilityMsg}</p>
                    <Link to="/bookings/my" className="text-xs text-amber-600 dark:text-amber-400 underline mt-1 inline-block">
                      View My Bookings
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Select Booking <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBookingId}
                      onChange={(e) => setSelectedBookingId(e.target.value)}
                      className="input-field pr-9 appearance-none"
                      required
                    >
                      {eligibleBookings.map((b) => (
                        <option key={b._id || b.id} value={b._id || b.id}>
                          #{String(b._id || b.id).slice(-8).toUpperCase()} — {b.status} —{' '}
                          {b.travelDate
                            ? new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'No date'}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Only confirmed / completed bookings are shown
                  </p>
                </div>
              )}

              {/* Only show rest of form if eligible */}
              {!eligibilityMsg && !loadingBookings && (
                <>
                  {/* Star rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-field"
                      placeholder="Summarize your experience"
                      maxLength={100}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input-field h-28 resize-none"
                      placeholder="Tell others about your experience…"
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-400 mt-1">{comment.length} / 1000</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium disabled:opacity-60 transition-colors"
                    >
                      {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Review
                    </button>
                  </div>
                </>
              )}

              {/* Cancel when ineligible */}
              {eligibilityMsg && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review: any) => (
            <div key={review._id} className="pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-start gap-3">
                <img
                  src={
                    review.user?.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'U')}&background=10B981&color=fff`
                  }
                  alt={review.user?.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <StarRating value={review.rating ?? 0} readOnly />
                        <span className="text-xs text-gray-400">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })
                            : ''}
                        </span>
                        {review.isVerified && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {user &&
                      (String(user.id) === String(review.user?._id) ||
                        (user as any).role === 'admin') && (
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                  {review.title && (
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-2 text-sm">{review.title}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
