import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, IndianRupee, ChevronRight, Plus, CircleAlert as AlertCircle } from 'lucide-react';
import { useMyCustomTours } from '../hooks/useCustomTours';
import { PageLoader } from '../components/ui/LoadingSpinner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function MyCustomTours() {
  const { requests, loading, error } = useMyCustomTours();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              My Custom Tour Requests
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track and manage your custom tour requests
            </p>
          </div>
          <Link
            to="/custom-tour-request"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Request
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No custom tour requests yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first custom tour request and let us plan your perfect trip!
            </p>
            <Link
              to="/custom-tour-request"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Custom Tour
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map((request: any, index: number) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                        {request.requestId}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span>{request.destinations?.join(', ')}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.adults} adult{request.adults > 1 ? 's' : ''}{request.children > 0 ? `, ${request.children} children` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        <span>{request.budget?.toLocaleString('en-IN')} {request.budgetType === 'per_person' ? '/person' : 'total'}</span>
                      </div>
                    </div>

                    {request.quotedPrice && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-400">
                          <span className="font-medium">Quoted Price:</span> ₹{request.quotedPrice?.toLocaleString('en-IN')}
                        </p>
                        {request.adminNotes && (
                          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                            <span className="font-medium">Note:</span> {request.adminNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 hidden md:block" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
