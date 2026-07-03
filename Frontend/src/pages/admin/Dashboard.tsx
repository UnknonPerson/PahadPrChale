import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  CalendarCheck, IndianRupee, Map, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import api from '../../services/api';
import { fallbackDashboardStats } from '../../data/adminData';

const ZERO_STATS = { totalBookings: 0, revenue: 0, activeTours: 0, registeredUsers: 0, monthlyRevenue: [], recentActivity: [] };

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState(ZERO_STATS);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const [bookingsRes, usersRes] = await Promise.allSettled([
          bookingService.getAll({ limit: 100 }),
          api.get('/users', { params: { limit: 1 } }),
        ]);

        if (bookingsRes.status === 'fulfilled') {
          const raw = bookingsRes.value;
          const bookings = raw?.data ?? (Array.isArray(raw) ? raw : []);
          if (bookings.length > 0) {
            setRecentBookings(bookings.slice(0, 5));
            const pending = bookings.filter((b: any) => b.status === 'pending').length;
            const revenue = bookings
              .filter((b: any) => b.status === 'completed')
              .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
            setPendingCount(pending);
            setStats((prev) => ({ ...prev, totalBookings: bookings.length, revenue, activeTours: pending }));
          }
        }

        if (usersRes.status === 'fulfilled') {
          const total = usersRes.value?.pagination?.total ?? 0;
          if (total > 0) setStats((prev) => ({ ...prev, registeredUsers: total }));
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, change: '+12%', changeType: 'increase', color: 'from-blue-500 to-blue-600' },
    { title: 'Revenue', value: `₹${((stats.revenue ?? 0) / 100000).toFixed(1)}L`, icon: IndianRupee, change: '+18%', changeType: 'increase', color: 'from-green-500 to-green-600' },
    { title: 'Pending Approvals', value: pendingCount, icon: Map, change: pendingCount > 0 ? `${pendingCount} need action` : 'All clear', changeType: pendingCount > 0 ? 'decrease' : 'increase', color: 'from-orange-500 to-orange-600' },
    { title: 'Registered Users', value: (stats.registeredUsers ?? 0).toLocaleString(), icon: Users, change: '+5%', changeType: 'increase', color: 'from-teal-500 to-teal-600' },
  ];

  const getLastUpdatedText = () => {
    const diff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minute${diff > 1 ? 's' : ''} ago`;
    return lastUpdated.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mr-2">
                {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
              </span>
            )}
            Welcome back! Here's your travel business overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Updated: {getLastUpdatedText()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="h-10 w-16 skeleton rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 skeleton rounded" />
                    <div className="h-3 w-1/2 skeleton rounded" />
                  </div>
                  <div className="h-6 w-20 skeleton rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentBookings.map((booking: any) => (
                    <tr key={booking._id || booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-2 text-sm font-mono font-medium text-gray-900 dark:text-white">
                        #{String(booking._id || booking.id).slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-sm text-gray-900 dark:text-white">{booking.customerName}</p>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">
                        {booking.packageName || booking.vehicleName || 'Booking'}
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                        ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">No bookings yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Manage Bookings', link: '/admin/bookings', badge: pendingCount > 0 ? `${pendingCount} pending` : null },
              { label: 'Add Package', link: '/admin/packages', badge: null },
              { label: 'Add Destination', link: '/admin/destinations', badge: null },
              { label: 'View Messages', link: '/admin/messages', badge: null },
              { label: 'Custom Tours', link: '/admin/custom-tours', badge: null },
              { label: 'Review Requests', link: '/admin/reviews', badge: null },
            ].map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">{item.badge}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Monthly revenue for the past 6 months</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />+24.5%
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-4 px-4">
          {stats.monthlyRevenue.map((data) => {
            const maxAmount = Math.max(...stats.monthlyRevenue.map((d) => d.amount));
            const height = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 10;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-16 bg-gray-100 dark:bg-gray-700 rounded-t-lg relative" style={{ height: `${height}%` }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-lg" style={{ height: '100%' }} />
                </div>
                <span className="text-xs font-medium text-gray-500">{data.month}</span>
                <span className="text-xs text-gray-400">₹{(data.amount / 1000).toFixed(0)}K</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
