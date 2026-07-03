import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ListFilter as Filter, Eye, Check, X, Trash2, CalendarCheck, Loader, RefreshCw, MoveVertical as MoreVertical, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { useAllBookings, useBookingActions } from '../../hooks/useBookings';
import ExportButton from '../../components/ui/ExportButton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const STATUS_FILTERS = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_COLOR: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  rejected:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface BookingRow {
  _id?: string;
  id?: string;
  bookingId?: string;
  type?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  travelers?: number;
  travelDate?: string;
  totalAmount?: number;
  status: string;
  specialRequests?: string;
  packageName?: string;
  vehicleName?: string;
  package?: { name?: string };
  vehicle?: { vehicleName?: string; name?: string };
}

// Rows-only optimistic update: mutate a single booking in the list without refetch
function applyUpdate(list: BookingRow[], mongoId: string, patch: Partial<BookingRow>): BookingRow[] {
  return list.map((b) => (getMongoId(b) === mongoId ? { ...b, ...patch } : b));
}
function getMongoId(b: BookingRow) { return b._id || b.id || ''; }
function getDisplayId(b: BookingRow) { return b.bookingId || b._id || b.id || ''; }
function getBookingName(b: BookingRow) {
  return b.type === 'vehicle'
    ? b.vehicleName || b.vehicle?.vehicleName || b.vehicle?.name || 'Vehicle Booking'
    : b.packageName || b.package?.name || 'Package Booking';
}

// ─── Row action menu ───────────────────────────────────────────────────────

function ActionMenu({
  booking,
  onView,
  onConfirm,
  onCancel,
  onComplete,
  onDelete,
  busy,
}: {
  booking: BookingRow;
  onView: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1">
        {/* Eye always visible */}
        <button
          onClick={onView}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-500 transition-colors"
          title="View details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Quick confirm for pending */}
        {booking.status === 'pending' && (
          <button
            onClick={onConfirm}
            disabled={busy}
            className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-40"
            title="Confirm booking"
          >
            {busy ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
        )}

        {/* More menu */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
          title="More actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden"
          >
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => { setOpen(false); onConfirm(); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Confirm
                </button>
                <button
                  onClick={() => { setOpen(false); onCancel(); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-500 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <>
                <button
                  onClick={() => { setOpen(false); onComplete(); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-500 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Completed
                </button>
                <button
                  onClick={() => { setOpen(false); onCancel(); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-500 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
            <div className="border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => { setOpen(false); onDelete(); }}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function Bookings() {
  const { bookings: rawBookings, loading, error, refetch } = useAllBookings();
  const { updateStatus, cancel, remove } = useBookingActions();
  const { success, error: toastError } = useToast();

  // Local copy for optimistic updates — avoids full refetch on every action
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  useEffect(() => { setBookings(rawBookings as BookingRow[]); }, [rawBookings]);

  const [searchQuery, setSearchQuery]     = useState('');
  const [statusFilter, setStatusFilter]   = useState('All');
  const [selected, setSelected]           = useState<BookingRow | null>(null);
  const [actionBusy, setActionBusy]       = useState<string | null>(null);

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', variant: 'danger', onConfirm: () => {} });

  const filtered = bookings.filter((b) => {
    const idStr  = getDisplayId(b).toLowerCase();
    const name   = getBookingName(b).toLowerCase();
    const q      = searchQuery.toLowerCase();
    const matchQ = !q || b.customerName?.toLowerCase().includes(q) || idStr.includes(q) || name.includes(q);
    const matchS = statusFilter === 'All' || b.status === statusFilter;
    return matchQ && matchS;
  });

  // ── Actions ────────────────────────────────────────────────────────────

  const runAction = async (
    mongoId: string,
    key: string,
    action: () => Promise<any>,
    successMsg: string,
    patch: Partial<BookingRow>
  ) => {
    setActionBusy(key);
    try {
      await action();
      // Optimistic update
      setBookings((prev) => applyUpdate(prev, mongoId, patch));
      if (selected && getMongoId(selected) === mongoId) {
        setSelected((s) => s ? { ...s, ...patch } : s);
      }
      success(successMsg);
    } catch (err: any) {
      toastError(err?.response?.data?.message || 'Action failed');
      refetch(); // re-sync on error
    } finally {
      setActionBusy(null);
    }
  };

  const askConfirm = (
    title: string,
    message: string,
    variant: 'danger' | 'warning' | 'info',
    onConfirm: () => void
  ) => setConfirmDialog({ open: true, title, message, variant, onConfirm });

  const handleConfirmBooking = (b: BookingRow) => {
    const mid = getMongoId(b);
    runAction(mid, mid + '-confirm', () => updateStatus(mid, 'confirmed'), 'Booking confirmed', { status: 'confirmed' });
  };

  const handleCancelBooking = (b: BookingRow) => {
    askConfirm(
      'Cancel Booking',
      `Cancel booking for ${b.customerName}? This will notify the customer.`,
      'warning',
      () => runAction(getMongoId(b), getMongoId(b) + '-cancel', () => cancel(getMongoId(b)), 'Booking cancelled', { status: 'cancelled' })
    );
  };

  const handleCompleteBooking = (b: BookingRow) => {
    const mid = getMongoId(b);
    runAction(mid, mid + '-complete', () => updateStatus(mid, 'completed'), 'Booking marked completed', { status: 'completed' });
  };

  const handleDeleteBooking = (b: BookingRow) => {
    askConfirm(
      'Delete Booking',
      `Permanently delete this booking? This cannot be undone.`,
      'danger',
      () => runAction(
        getMongoId(b),
        getMongoId(b) + '-delete',
        () => remove(getMongoId(b)),
        'Booking deleted',
        { status: 'cancelled' } // will be removed via refetch below
      ).then(() => {
        setBookings((prev) => prev.filter((x) => getMongoId(x) !== getMongoId(b)));
        if (selected && getMongoId(selected) === getMongoId(b)) setSelected(null);
      })
    );
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Bookings</h1>
          <div className="flex items-center gap-2 mt-1">
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium">
                {pendingCount} pending
              </span>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {bookings.length} total bookings
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <ExportButton type="bookings" data={bookings} />
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
            className={`glass-card p-4 text-left transition-all hover:shadow-md ${
              statusFilter === s ? 'ring-2 ring-primary-500 shadow-md' : ''
            }`}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {bookings.filter((b) => b.status === s).length}
            </p>
            <p className="text-sm capitalize text-gray-500 dark:text-gray-400 mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Search + Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, customer or package…"
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
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
            <Loader className="w-5 h-5 animate-spin text-primary-500" />
            Loading bookings…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="table-th">Booking ID</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Package / Vehicle</th>
                  <th className="table-th">Travel Date</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {filtered.map((booking, idx) => (
                    <motion.tr
                      key={getMongoId(booking) || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span className="font-mono font-medium text-gray-900 dark:text-white">
                            #{getDisplayId(booking).slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="table-td">
                        <p className="font-medium text-gray-900 dark:text-white">{booking.customerName}</p>
                        <p className="text-xs text-gray-400">{booking.customerEmail}</p>
                      </td>
                      <td className="table-td">
                        <p className="text-gray-900 dark:text-white">{getBookingName(booking)}</p>
                        <p className="text-xs text-gray-400 capitalize">{booking.type || 'package'}</p>
                      </td>
                      <td className="table-td text-gray-600 dark:text-gray-300">
                        {booking.travelDate
                          ? new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="table-td font-semibold text-gray-900 dark:text-white">
                        ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="table-td">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="table-td">
                        <ActionMenu
                          booking={booking}
                          busy={!!actionBusy?.startsWith(getMongoId(booking))}
                          onView={() => setSelected(booking)}
                          onConfirm={() => handleConfirmBooking(booking)}
                          onCancel={() => handleCancelBooking(booking)}
                          onComplete={() => handleCompleteBooking(booking)}
                          onDelete={() => handleDeleteBooking(booking)}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-14 text-center text-gray-400">
                <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p>No bookings found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Details</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Booking ID', value: getDisplayId(selected) },
                  { label: 'Status', value: (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[selected.status] ?? ''}`}>
                      {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                    </span>
                  )},
                  { label: 'Customer', value: selected.customerName },
                  { label: 'Email', value: selected.customerEmail },
                  { label: 'Phone', value: selected.customerPhone || '—' },
                  { label: 'Travelers', value: selected.travelers },
                  { label: 'Package / Vehicle', value: getBookingName(selected), full: true },
                  { label: 'Travel Date', value: selected.travelDate ? new Date(selected.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                  { label: 'Total Amount', value: <span className="text-lg font-bold text-primary-500">₹{(selected.totalAmount || 0).toLocaleString('en-IN')}</span> },
                  ...(selected.specialRequests ? [{ label: 'Special Requests', value: selected.specialRequests, full: true }] : []),
                ].map((item, i) => (
                  <div key={i} className={item.full ? 'col-span-2' : ''}>
                    <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                    <div className="font-medium text-gray-900 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {selected.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleConfirmBooking(selected)}
                      disabled={!!actionBusy}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" /> Confirm
                    </button>
                    <button
                      onClick={() => handleCancelBooking(selected)}
                      disabled={!!actionBusy}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
                {selected.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleCompleteBooking(selected)}
                      disabled={!!actionBusy}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Completed
                    </button>
                    <button
                      onClick={() => handleCancelBooking(selected)}
                      disabled={!!actionBusy}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteBooking(selected)}
                  disabled={!!actionBusy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="ml-auto px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog((d) => ({ ...d, open: false }))}
        onConfirm={() => {
          setConfirmDialog((d) => ({ ...d, open: false }));
          confirmDialog.onConfirm();
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.variant === 'danger' ? 'Delete' : 'Confirm'}
        isLoading={!!actionBusy}
      />
    </div>
  );
}
