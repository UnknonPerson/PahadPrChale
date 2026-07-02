import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Users, MapPin, Phone, Mail,
  CircleCheck as CheckCircle, User, ArrowLeft, Car, Package, Loader,
} from 'lucide-react';
import Button from '../components/ui/Button';
import EmailVerificationModal from '../components/ui/EmailVerificationModal';
import { usePackages } from '../hooks/usePackages';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

type BookingType = 'package' | 'vehicle';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const bookingType = (searchParams.get('type') as BookingType) || 'package';
  const itemId = searchParams.get('id');

  // Require login (not verification — verification is handled inline)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: location.pathname + location.search } },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, location]);

  const { packages } = usePackages();
  const { vehicles } = useVehicles();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [formData, setFormData] = useState({
    packageId: '',
    vehicleId: '',
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: (user as any)?.phone || '',
    travelDate: '',
    travelers: 2,
    pickupLocation: '',
    returnDate: '',
    driverRequired: false,
    specialRequests: '',
  });

  useEffect(() => {
    if (itemId) {
      if (bookingType === 'package') setFormData(p => ({ ...p, packageId: itemId }));
      else if (bookingType === 'vehicle') setFormData(p => ({ ...p, vehicleId: itemId }));
    }
  }, [itemId, bookingType]);

  // Pre-fill user info when user loads
  useEffect(() => {
    if (user) {
      setFormData(p => ({
        ...p,
        customerName: p.customerName || user.name || '',
        customerEmail: p.customerEmail || user.email || '',
        customerPhone: p.customerPhone || (user as any).phone || '',
      }));
    }
  }, [user]);

  const selectedPackage = packages.find((p: any) => (p.id || p._id) === formData.packageId);
  const selectedVehicle = vehicles.find((v: any) => (v.id || v._id) === formData.vehicleId);

  const totalAmount = bookingType === 'package'
    ? (selectedPackage?.price || 0) * formData.travelers
    : selectedVehicle?.pricePerDay
      ? selectedVehicle.pricePerDay * Math.max(
          1,
          formData.returnDate && formData.travelDate
            ? Math.ceil(
                (new Date(formData.returnDate).getTime() - new Date(formData.travelDate).getTime())
                / 86400000
              )
            : 1
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(s => s + 1); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await bookingService.create({
        type: bookingType,
        packageId: formData.packageId || undefined,
        vehicleId: formData.vehicleId || undefined,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        travelDate: formData.travelDate,
        returnDate: formData.returnDate || undefined,
        travelers: formData.travelers,
        pickupLocation: formData.pickupLocation || undefined,
        driverRequired: formData.driverRequired,
        specialRequests: formData.specialRequests,
        totalAmount,
      });
      const id = response?.booking?._id || response?.booking?.id || response?._id;
      setBookingId(id);
      setStep(4);
    } catch (err: any) {
      // EMAIL_NOT_VERIFIED → show modal instead of error text
      if (err?.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setShowVerifyModal(true);
      } else {
        setError(err?.response?.data?.message || err?.message || 'Booking failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(p => ({
      ...p,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (!isAuthenticated) return null;

  // ── Step 4: Confirmation ──
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Your booking has been submitted successfully.
          </p>
          {bookingId && (
            <p className="text-sm font-mono text-primary-500 mb-6">
              #{String(bookingId).slice(-8).toUpperCase()}
            </p>
          )}
          <p className="text-sm text-gray-400 mb-6">
            A confirmation email has been sent to{' '}
            <span className="font-medium text-gray-600 dark:text-gray-300">{formData.customerEmail}</span>.
          </p>
          <div className="flex gap-3">
            <Link to="/bookings/my" className="flex-1">
              <Button variant="primary" className="w-full">View My Bookings</Button>
            </Link>
            <Link to="/packages" className="flex-1">
              <Button variant="outline" className="w-full">More Packages</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative h-56 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2161468/pexels-photo-2161468.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Book Your Trip"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {bookingType === 'vehicle' ? 'Book a Vehicle' : 'Book a Package'}
            </h1>
            <p className="text-white/70 text-sm">Complete your booking in 3 simple steps</p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          {[
            { n: 1, label: bookingType === 'vehicle' ? 'Vehicle' : 'Package' },
            { n: 2, label: 'Details' },
            { n: 3, label: 'Review' },
          ].map(({ n, label }, idx, arr) => (
            <div key={n} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= n ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {step > n ? <CheckCircle className="w-5 h-5" /> : n}
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">{label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 transition-colors ${step > n ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Step 1: Select Package/Vehicle ── */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  {bookingType === 'vehicle' ? <Car className="w-5 h-5 text-primary-500" /> : <Package className="w-5 h-5 text-primary-500" />}
                  Select {bookingType === 'vehicle' ? 'Vehicle' : 'Package'}
                </h2>

                {bookingType === 'package' ? (
                  <div className="space-y-3">
                    {packages.map((pkg: any) => {
                      const id = pkg.id || pkg._id;
                      return (
                        <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.packageId === id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}>
                          <input type="radio" name="packageId" value={id} checked={formData.packageId === id} onChange={handleChange} className="sr-only" />
                          <img src={pkg.image} alt={pkg.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{pkg.name}</p>
                            <p className="text-sm text-gray-500 truncate">{pkg.destination} · {pkg.duration}</p>
                          </div>
                          <p className="font-bold text-primary-500 whitespace-nowrap">₹{(pkg.price || 0).toLocaleString('en-IN')}</p>
                        </label>
                      );
                    })}
                    {packages.length === 0 && <p className="text-center text-gray-400 py-8">No packages available.</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vehicles.map((v: any) => {
                      const id = v.id || v._id;
                      return (
                        <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.vehicleId === id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}>
                          <input type="radio" name="vehicleId" value={id} checked={formData.vehicleId === id} onChange={handleChange} className="sr-only" />
                          <img src={v.image || v.images?.[0]} alt={v.vehicleName} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white">{v.vehicleName}</p>
                            <p className="text-sm text-gray-500">{v.vehicleType} · {v.seats} seats</p>
                          </div>
                          <p className="font-bold text-primary-500 whitespace-nowrap">₹{(v.pricePerDay || 0).toLocaleString('en-IN')}/day</p>
                        </label>
                      );
                    })}
                    {vehicles.length === 0 && <p className="text-center text-gray-400 py-8">No vehicles available.</p>}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Traveler Details ── */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-6 space-y-5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />Traveler Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="customerName" value={formData.customerName} onChange={handleChange} required className="input-field pl-9" placeholder="Your full name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} required className="input-field pl-9" placeholder="email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} required className="input-field pl-9" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Travelers *</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="travelers" type="number" min={1} max={20} value={formData.travelers} onChange={handleChange} required className="input-field pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{bookingType === 'vehicle' ? 'Pickup Date' : 'Travel Date'} *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="travelDate" type="date" min={minDate} value={formData.travelDate} onChange={handleChange} required className="input-field pl-9" />
                    </div>
                  </div>
                  {bookingType === 'vehicle' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Return Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input name="returnDate" type="date" min={formData.travelDate || minDate} value={formData.returnDate} onChange={handleChange} required={bookingType === 'vehicle'} className="input-field pl-9" />
                      </div>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className="input-field pl-9" placeholder="Airport, Hotel, or address" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                    <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Dietary needs, accessibility requirements, etc." />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Review & Confirm ── */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Review Your Booking</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {bookingType === 'vehicle' ? 'Vehicle' : 'Package'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedPackage?.name || selectedVehicle?.vehicleName || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Traveler</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formData.customerName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{bookingType === 'vehicle' ? 'Pickup Date' : 'Travel Date'}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formData.travelDate ? new Date(formData.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Travelers</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formData.travelers}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
                      <span className="font-bold text-xl text-primary-500">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Email verification notice */}
                  {!(user as any)?.isEmailVerified && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <span className="text-yellow-600 text-lg leading-none mt-0.5">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Email verification required</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-0.5">
                          You'll be prompted to verify your email before the booking is confirmed.
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <Link to={bookingType === 'vehicle' ? '/vehicles' : '/packages'} className="btn-ghost flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Browse
              </Link>
            )}
            <button
              type="submit"
              disabled={isSubmitting || (step === 1 && !formData.packageId && !formData.vehicleId)}
              className="btn-primary min-w-[140px]"
            >
              {isSubmitting
                ? <><Loader className="w-4 h-4 animate-spin" />Processing...</>
                : step === 3
                  ? 'Confirm Booking'
                  : <>Continue</>
              }
            </button>
          </div>
        </form>
      </div>

      {/* Email verification modal */}
      <EmailVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        actionName="confirm your booking"
      />
    </div>
  );
}
