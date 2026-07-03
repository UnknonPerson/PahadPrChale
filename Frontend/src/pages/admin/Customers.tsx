import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Mail, Phone, Calendar, IndianRupee, Users, RefreshCw, ShieldCheck, CircleAlert as AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface Customer {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalBookings?: number;
  totalSpent?: number;
}

function getAvatar(c: Customer) {
  return c.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=10B981&color=fff&size=64`;
}

export default function Customers() {
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = useCallback(async (currentPage = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users', {
        params: {
          page: currentPage,
          limit: 20,
          ...(search ? { search } : {}),
          ...(statusFilter !== 'All' ? { isActive: statusFilter === 'active' } : {}),
        },
      });
      const users: Customer[] = res?.data?.users ?? res?.users ?? res?.data ?? [];
      setCustomers(users);
      setTotalCount(res?.pagination?.total ?? users.length);
      setTotalPages(res?.pagination?.pages ?? 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchCustomers(1, searchQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter, fetchCustomers]);

  const filteredCustomers = customers; // filtering handled server-side

  const activeCount   = customers.filter((c) => c.isActive).length;
  const verifiedCount = customers.filter((c) => c.isEmailVerified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalCount.toLocaleString()} registered users
          </p>
        </div>
        <button
          onClick={() => fetchCustomers(page, searchQuery)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{totalCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active (this page)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-secondary-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Verified (this page)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{verifiedCount}</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* Search + Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email…"
              className="input-field pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              className="input-field w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Loading customers…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="table-th">Customer</th>
                  <th className="table-th">Contact</th>
                  <th className="table-th">Joined</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Verified</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredCustomers.map((customer, idx) => (
                  <motion.tr
                    key={customer._id || customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.2) }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatar(customer)}
                          alt={customer.name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=10B981&color=fff&size=64`;
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{customer.name}</p>
                          <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          <span className="truncate max-w-[140px]">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />{customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                        customer.isEmailVerified
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400'
                      }`}>
                        {customer.isEmailVerified
                          ? <><ShieldCheck className="w-3.5 h-3.5" /> Verified</>
                          : 'Unverified'}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {filteredCustomers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-gray-400 text-sm">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500">{totalCount} total users</p>
            <div className="flex gap-2">
              <button
                onClick={() => { setPage((p) => p - 1); fetchCustomers(page - 1, searchQuery); }}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-xs text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => { setPage((p) => p + 1); fetchCustomers(page + 1, searchQuery); }}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
