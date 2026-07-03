import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle, Calendar, Users, MapPin, CreditCard, Clock, Phone, Mail, Package, ArrowRight, Hop as Home, MessageSquare, Download, Printer } from 'lucide-react';

interface BookingDetails {
  bookingId: string;
  packageName?: string;
  vehicleName?: string;
  destination?: string;
  travelDate?: string;
  travelers?: number;
  totalAmount?: number;
  paymentStatus?: string;
  bookingDate?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  type?: 'package' | 'vehicle';
}

const TIMELINE = [
  { label: 'Booking Submitted',         done: true },
  { label: 'Booking Confirmed',          done: true },
  { label: 'Team Will Contact You',      done: false },
  { label: 'Payment Verification',       done: false },
  { label: 'Ready for Travel',           done: false },
];

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const details: BookingDetails = location.state?.booking || {};
  const [printing, setPrinting] = useState(false);

  // If someone navigates here directly without booking data, redirect
  useEffect(() => {
    if (!details.bookingId) {
      navigate('/packages', { replace: true });
    }
  }, [details.bookingId, navigate]);

  if (!details.bookingId) return null;

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  const shortId = String(details.bookingId).slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 md:py-14 print:bg-white print:py-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* ── Success header ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 shadow-lg shadow-green-500/10">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Thank you! Your booking has been received successfully.
          </p>
        </motion.div>

        {/* ── Status card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 mb-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <h2 className="font-semibold text-green-800 dark:text-green-300">Current Status: Booking Confirmed</h2>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400 ml-8">
            Our team has received your booking request. We will contact you shortly to confirm all details and complete the booking process.
          </p>
        </motion.div>

        {/* ── Booking details card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-5 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Booking Details</h3>
              <span className="font-mono text-sm font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                #{shortId}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              {
                icon: Package,
                label: details.type === 'vehicle' ? 'Vehicle' : 'Package',
                value: details.packageName || details.vehicleName || '—',
              },
              details.destination && {
                icon: MapPin,
                label: 'Destination',
                value: details.destination,
              },
              details.travelDate && {
                icon: Calendar,
                label: details.type === 'vehicle' ? 'Pickup Date' : 'Travel Date',
                value: new Date(details.travelDate).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                }),
              },
              details.travelers && {
                icon: Users,
                label: 'Travelers',
                value: `${details.travelers} ${details.travelers === 1 ? 'person' : 'people'}`,
              },
              details.totalAmount != null && {
                icon: CreditCard,
                label: 'Total Amount',
                value: `₹${Number(details.totalAmount).toLocaleString('en-IN')}`,
                highlight: true,
              },
              {
                icon: CreditCard,
                label: 'Payment Status',
                value: details.paymentStatus || 'Pending',
              },
              {
                icon: Clock,
                label: 'Booking Date',
                value: details.bookingDate
                  ? new Date(details.bookingDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })
                  : new Date().toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    }),
              },
              details.customerName && {
                icon: Users,
                label: 'Customer Name',
                value: details.customerName,
              },
              details.customerEmail && {
                icon: Mail,
                label: 'Email',
                value: details.customerEmail,
              },
              details.customerPhone && {
                icon: Phone,
                label: 'Phone',
                value: details.customerPhone,
              },
            ]
              .filter(Boolean)
              .map((row: any, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-3.5">
                  <row.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">{row.label}</span>
                  <span className={`text-sm font-medium flex-1 ${row.highlight ? 'text-primary-500 font-bold text-base' : 'text-gray-900 dark:text-white'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-5 shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Status Timeline</h3>
          <div className="space-y-0">
            {TIMELINE.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done
                      ? 'bg-green-500 shadow-md shadow-green-500/25'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {step.done
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    }
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-green-300 dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
                <div className="pb-8 last:pb-0 min-w-0">
                  <p className={`text-sm font-medium mt-1.5 ${
                    step.done
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.done ? '✅' : '⏳'} {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3 print:hidden"
        >
          {/* Primary row */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/bookings/my" className="contents">
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors">
                <Calendar className="w-4 h-4" />
                View My Bookings
              </button>
            </Link>
            <Link to="/" className="contents">
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold transition-colors">
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>

          {/* Secondary row */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/contact" className="contents">
              <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-500 text-sm font-medium transition-colors">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </button>
            </Link>
            <button
              onClick={handlePrint}
              disabled={printing}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-500 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              {printing ? 'Opening…' : 'Download / Print'}
            </button>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6 print:hidden"
        >
          A confirmation email has been sent to{' '}
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {details.customerEmail || 'your registered email'}
          </span>.
        </motion.p>
      </div>
    </div>
  );
}
