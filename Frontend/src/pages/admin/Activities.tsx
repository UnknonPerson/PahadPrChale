import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Hotel, Car, MapPin, MessageSquare, Calendar, ListFilter as Filter, Activity as ActivityIcon, RefreshCw } from 'lucide-react';
import { useActivities, useActivityStats } from '../../hooks/useActivities';

const activityIcons: Record<string, any> = {
  user_registered: User,
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
  booking_created: 'bg-primary-500',
  booking_cancelled: 'bg-red-500',
  booking_updated: 'bg-orange-500',
  package_created: 'bg-emerald-500',
  package_updated: 'bg-teal-500',
  package_deleted: 'bg-red-500',
  hotel_created: 'bg-cyan-500',
  hotel_updated: 'bg-sky-500',
  hotel_deleted: 'bg-red-500',
  vehicle_created: 'bg-blue-500',
  vehicle_updated: 'bg-blue-400',
  vehicle_deleted: 'bg-red-500',
  destination_created: 'bg-amber-500',
  destination_updated: 'bg-yellow-500',
  destination_deleted: 'bg-red-500',
  message_sent: 'bg-pink-500',
  message_replied: 'bg-rose-500',
  custom_tour_requested: 'bg-lime-500',
  custom_tour_updated: 'bg-green-500',
};

// Only show admin-relevant activity types (no login/logout)
const importantActivityTypes = [
  'All',
  'user_registered',
  'booking_created',
  'booking_cancelled',
  'booking_updated',
  'package_created',
  'package_updated',
  'package_deleted',
  'hotel_created',
  'hotel_updated',
  'hotel_deleted',
  'vehicle_created',
  'vehicle_updated',
  'vehicle_deleted',
  'destination_created',
  'destination_updated',
  'destination_deleted',
  'message_sent',
  'message_replied',
  'custom_tour_requested',
  'custom_tour_updated',
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

  // Filter out login/logout events from display
  const filteredActivities = activities.filter(
    (a: any) => a.type !== 'user_login' && a.type !== 'user_logout'
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals: Record<string, number> = {
      year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60,
    };
    for (const [unit, s] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / s);
      if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  const getTypeName = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Important system events and actions</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: statsLoading ? '...' : stats?.totalAllTime || 0, color: 'bg-primary-500/10', icon: ActivityIcon, iconColor: 'text-primary-500' },
          { label: 'Today', value: statsLoading ? '...' : stats?.today || 0, color: 'bg-green-500/10', icon: Calendar, iconColor: 'text-green-500' },
          { label: 'Last 7 Days', value: statsLoading ? '...' : stats?.last7Days || 0, color: 'bg-blue-500/10', icon: Calendar, iconColor: 'text-blue-500' },
          { label: 'Last 30 Days', value: statsLoading ? '...' : stats?.last30Days || 0, color: 'bg-orange-500/10', icon: Calendar, iconColor: 'text-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="input-field"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            {importantActivityTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Activities' : getTypeName(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">{error}</div>
      )}

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No activities found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredActivities.map((activity: any, index: number) => {
              const IconComponent = activityIcons[activity.type] || ActivityIcon;
              const bgColor = activityColors[activity.type] || 'bg-gray-500';
              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">{getTypeName(activity.type)}</p>
                        {activity.user && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {activity.user.name || activity.user.email || 'System'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1" title={formatDate(activity.createdAt)}>
                        {timeAgo(activity.createdAt)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredActivities.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={filteredActivities.length < 20}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
