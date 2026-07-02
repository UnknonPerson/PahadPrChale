import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Phone, Mail, CircleCheck as CheckCircle, User, ArrowLeft, Car, Package, Loader, LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import { usePackages } from '../hooks/usePackages';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';

type BookingType = 'package' | 'vehicle';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const bookingType = (searchParams.get('type') as BookingType) || 'package';
  const itemId = searchParams.get('id');

  // Redirect to login if not authenticated
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

  const [formData, setFormData] = useState({
    packageId: '',
    vehicleId: '',
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    travelDate: '',
    travelers: 2,
    pickupLocation: '',
    returnDate: '',
    driverRequired: false,
    specialRequests: '',
  });

  useEffect(() => {
    if (itemId) {
      if (bookingType === 'package') {
        setFormData(prev => ({ ...prev, packageId: itemId }));
      } else if (bookingType === 'vehicle') {
        setFormData(prev => ({ ...prev, vehicleId: itemId }));
      }
    }
  }, [itemId, bookingType]);

  const selectedPackage = packages.find((p: any) => (p.id || p._id) === formData.packageId);
  const selectedVehicle = vehicles.find((v: any) => (v.id || v._id) === formData.vehicleId);

  const totalAmount = bookingType === 'package'
    ? (selectedPackage?.price || 0) * formData.travelers
    : selectedVehicle?.pricePerDay
      ? selectedVehicle.pricePerDay * (
          formData.returnDate && formData.travelDate
            ? Math.ceil((new Date(formData.returnDate).getTime() - new Date(formData.travelDate).getTime()) / (1000 * 60 * 60 * 24)) || 1
            : 1
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = {
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
      };

      const response = await bookingService.create(bookingData);
      const newBookingId = response.booking?._id || response.booking?.id || response._id || response.id;
      setBookingId(newBookingId);
      setStep(4);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      {/* Hero Banner */}
      <section className="relative h-64 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2161468/pexels-photo-2161468.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Book Your Trip"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              {bookingType === 'vehicle' ? 'Book Your Vehicle' : 'Book Your Adventure'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              {bookingType === 'vehicle'
                ? 'Reserve your perfect ride for the journey ahead'
                : 'Let us help you plan your perfect Northeast India journey'}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to={bookingType === 'vehicle' ? '/vehicles' : '/packages'}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {bookingType === 'vehicle' ? 'Vehicles' : 'Packages'}
          </Link>

          {/* Progress Steps */}
          {step < 4 && (
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-20 md:w-32 h-1 mx-2 rounded transition-colors ${
                      step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Item */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    {bookingType === 'vehicle' ? <Car className="w-7 h-7 text-primary-500" /> : <Package className="w-7 h-7 text-primary-500" />}
                    Select Your {bookingType === 'vehicle' ? 'Vehicle' : 'Package'}
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      {bookingType === 'vehicle' ? 'Choose Vehicle' : 'Choose Package'} *
                    </label>
                    <select
                      name={bookingType === 'vehicle' ? 'vehicleId' : 'packageId'}
                      value={bookingType === 'vehicle' ? formData.vehicleId : formData.packageId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select {bookingType === 'vehicle' ? 'a vehicle' : 'a package'}</option>
                      {bookingType === 'vehicle'
                        ? vehicles.map((v: any) => (
                            <option key={v.id || v._id} value={v.id || v._id}>
                              {v.name || v.vehicleName} - {v.type || v.vehicleType} ({v.seats} seats) - Rs {v.pricePerDay}/day
                            </option>
                          ))
                        : packages.map((p: any) => (
                            <option key={p.id || p._id} value={p.id || p._id}>
                              {p.name} - {p.duration} - Rs {p.price}/person
                            </option>
                          ))
                      }
                    </select>
                  </div>

                  {/* Selected Item Preview */}
                  {(selectedPackage || selectedVehicle) && (
                    <div className="glass-card p-4 border border-primary-200 dark:border-primary-800">
                      <div className="flex gap-4">
                        <img
                          src={
                            bookingType === 'vehicle'
                              ? (selectedVehicle?.image || selectedVehicle?.images?.[0] || 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg')
                              : (selectedPackage?.image || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg')
                          }
                          alt={selectedPackage?.name || selectedVehicle?.name || selectedVehicle?.vehicleName || 'Selected'}
                          className="w-32 h-24 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {selectedPackage?.name || selectedVehicle?.name || selectedVehicle?.vehicleName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {bookingType === 'vehicle'
                              ? `${selectedVehicle?.type || selectedVehicle?.vehicleType} • ${selectedVehicle?.seats} seats`
                              : selectedPackage?.duration
                            }
                          </p>
                          <p className="text-lg font-bold text-primary-500 mt-1">
                            Rs {bookingType === 'vehicle'
                              ? `${selectedVehicle?.pricePerDay?.toLocaleString()}/day`
                              : `${selectedPackage?.price?.toLocaleString()}/person`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        {bookingType === 'vehicle' ? 'Pickup Date' : 'Travel Date'} *
                      </label>
                      <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="input-field"
                        min={minDate}
                        required
                      />
                    </div>

                    {bookingType === 'vehicle' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                          Return Date *
                        </label>
                        <input
                          type="date"
                          name="returnDate"
                          value={formData.returnDate}
                          onChange={handleChange}
                          className="input-field"
                          min={formData.travelDate || minDate}
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Number of {bookingType === 'vehicle' ? 'Passengers' : 'Travelers'} *
                      </label>
                      <input
                        type="number"
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleChange}
                        className="input-field"
                        min="1"
                        max={bookingType === 'vehicle' ? (selectedVehicle?.seats || 50) : 20}
                        required
                      />
                    </div>

                    {bookingType === 'vehicle' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                          Pickup Location *
                        </label>
                        <input
                          type="text"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="e.g., Bagdogra Airport, Siliguri"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {bookingType === 'vehicle' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="driverRequired"
                        name="driverRequired"
                        checked={formData.driverRequired}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <label htmlFor="driverRequired" className="text-gray-700 dark:text-gray-300">
                        I need a driver (additional charges may apply)
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Contact Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                    Your Contact Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="input-field h-24 resize-none"
                      placeholder="Any special requirements, dietary preferences, or accessibility needs..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                    Review Your Booking
                  </h2>

                  <div className="glass-card p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          bookingType === 'vehicle'
                            ? (selectedVehicle?.image || selectedVehicle?.images?.[0] || 'https://images.pexels.com/photos/1209398/pexels-photo-1209398.jpeg')
                            : (selectedPackage?.image || 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg')
                        }
                        alt="Selected"
                        className="w-32 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {selectedPackage?.name || selectedVehicle?.name || selectedVehicle?.vehicleName}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {bookingType === 'vehicle'
                            ? `${selectedVehicle?.type || selectedVehicle?.vehicleType} • ${selectedVehicle?.seats} seats`
                            : selectedPackage?.duration
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formData.travelDate}</span>
                      </div>
                      {formData.returnDate && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Return: {formData.returnDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{formData.travelers} {bookingType === 'vehicle' ? 'Passengers' : 'Travelers'}</span>
                      </div>
                      {formData.pickupLocation && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{formData.pickupLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{formData.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{formData.customerPhone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                        <span className="text-2xl font-bold text-primary-500">
                          Rs {totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        * Payment will be collected upon confirmation
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center space-y-6 py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    Booking Confirmed!
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Thank you for your booking request. Our travel consultant will contact you
                    within 24 hours to confirm your reservation.
                  </p>

                  {bookingId && (
                    <div className="glass-card p-4 max-w-sm mx-auto">
                      <p className="text-sm text-gray-500">Your Booking ID</p>
                      <p className="text-xl font-mono font-bold text-primary-500">{bookingId}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link to="/bookings/my">
                      <Button variant="primary">
                        View My Bookings
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button variant="outline">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {step < 4 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(step - 1)}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || (step === 1 && !formData.packageId && !formData.vehicleId)}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : step === 3 ? (
                      'Confirm Booking'
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
