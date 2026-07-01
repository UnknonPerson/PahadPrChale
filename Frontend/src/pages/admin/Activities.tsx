import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, LogOut, Package, Hotel, Car, MapPin, MessageSquare, Calendar, Trash2, ListFilter as Filter, Activity as ActivityIcon, RefreshCw } from 'lucide-react';
import { useActivities, useActivityStats } from '../../hooks/useActivities';

const activityIcons: Record<string, any> = {
  user_registered: User,
  user_login: LogIn,
  user_logout: LogOut,
  profile_updated: User,
  booking_created: Calendar,
  booking_cancelled: Calendar,
  booking_updated: Calendar,
  package_created: Package,
  package_updated: Package,
  package_deleted: Package,
  hotel_created: Hotel,
  hotel_updated: Hotel,
  hotel_deleted: Hotel,
  vehicle_created: Car,
  vehicle_updated: Car,
  vehicle_deleted: Car,
  destination_created: MapPin,
  destination_updated: MapPin,
  destination_deleted: MapPin,
  message_sent: MessageSquare,
  message_replied: MessageSquare,
  custom_tour_requested: Calendar,
  custom_tour_updated: Calendar,
};

const activityColors: Record<string, string> = {
  user_registered: 'bg-green-500',
  user_login: 'bg-blue-500',
  user_logout: 'bg-gray-500',
  profile_updated: 'bg-purple-500',
  booking_created: 'bg-primary-500',
  booking_cancelled: 'bg-red-500',
  booking_updated: 'bg-orange-500',
  package_created: 'bg-emerald-500',
  package_updated: 'bg-teal-500',
  package_deleted: 'bg-red-500',
  hotel_created: 'bg-cyan-500',
  hotel_updated: 'bg-sky-500',
  hotel_deleted: 'bg-red-500',
  vehicle_created: 'bg-indigo-500',
  vehicle_updated: 'bg-violet-500',
  vehicle_deleted: 'bg-red-500',
  destination_created: 'bg-amber-500',
  destination_updated: 'bg-yellow-500',
  destination_deleted: 'bg-red-500',
  message_sent: 'bg-pink-500',
  message_replied: 'bg-rose-500',
  custom_tour_requested: 'bg-lime-500',
  custom_tour_updated: 'bg-green-500',
};

const activityTypes = [
  'All',
  'user_registered',
  'user_login',
  'user_logout',
  'booking_created',
  'package_created',
  'hotel_created',
  'vehicle_created',
  'message_sent',
  'custom_tour_requested',
];

export default function Activities() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);

  const { activities, loading, error, refetch } = useActivities({
    type: typeFilter !== 'All' ? typeFilter : undefined,
    page,
    limit: 20,
  });
  const { stats, loading: statsLoading } = useActivityStats();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  const getTypeName = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Activities
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track all system activities and events
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <ActivityIcon className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.totalAllTime || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.today || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last 7 Days</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.last7Days || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last 30 Days</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.last30Days || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="input-field"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Activities' : getTypeName(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Activities List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No activities found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity: any, index: number) => {
              const IconComponent = activityIcons[activity.type] || ActivityIcon;
              const bgColor = activityColors[activity.type] || 'bg-gray-500';

              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getTypeName(activity.type)}
                        </p>
                        {activity.user && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {activity.user.name || activity.user.email || 'Unknown'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span title={formatDate(activity.createdAt)}>
                          {timeAgo(activity.createdAt)}
                        </span>
                        {activity.ipAddress && (
                          <span>IP: {activity.ipAddress}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {activities.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={activities.length < 20}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
