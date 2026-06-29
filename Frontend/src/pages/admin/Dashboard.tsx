import { motion } from 'framer-motion';
import {
  CalendarCheck,
  IndianRupee,
  Map,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardStats, bookings } from '../../data/adminData';

const statCards = [
  {
    title: 'Total Bookings',
    value: dashboardStats.totalBookings,
    icon: CalendarCheck,
    change: '+12%',
    changeType: 'increase',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Revenue',
    value: `₹${(dashboardStats.revenue / 100000).toFixed(1)}L`,
    icon: IndianRupee,
    change: '+18%',
    changeType: 'increase',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Active Tours',
    value: dashboardStats.activeTours,
    icon: Map,
    change: '+5%',
    changeType: 'increase',
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Registered Users',
    value: dashboardStats.registeredUsers.toLocaleString(),
    icon: Users,
    change: '-3%',
    changeType: 'decrease',
    color: 'from-purple-500 to-purple-600',
  },
];

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

export default function Dashboard() {
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your travel business.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                      {booking.id}
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-sm text-gray-900 dark:text-white">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">
                      {booking.packageName}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(booking.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-900 dark:text-white">
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {dashboardStats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'booking'
                      ? 'bg-blue-500'
                      : activity.type === 'review'
                      ? 'bg-yellow-500'
                      : activity.type === 'message'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monthly revenue for the past 6 months
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            +24.5%
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 px-4">
          {dashboardStats.monthlyRevenue.map((data) => {
            const maxAmount = Math.max(...dashboardStats.monthlyRevenue.map(d => d.amount));
            const height = (data.amount / maxAmount) * 100;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-16 bg-gray-100 dark:bg-gray-700 rounded-t-lg relative" style={{ height: `${height}%` }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-lg transition-all"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {data.month}
                </span>
                <span className="text-xs text-gray-400">
                  ₹{(data.amount / 1000).toFixed(0)}K
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
