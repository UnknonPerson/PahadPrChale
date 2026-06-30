import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Hotel, Car, Calculator, Plus, Trash2, CircleCheck as CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useDestinations } from '../hooks/useDestinations';
import { useHotels } from '../hooks/useHotels';
import { useVehicles } from '../hooks/useVehicles';
import { useTripActions } from '../hooks/useTrips';
import Button from '../components/ui/Button';

interface DestinationStop {
  destination: string;
  days: number;
}

export default function TripPlanner() {
  const { success, error } = useToast();
  const navigate = useNavigate();
  const { destinations } = useDestinations();
  const { hotels } = useHotels();
  const { vehicles } = useVehicles();
  const { submitTripPlanner } = useTripActions();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tripData, setTripData] = useState({
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    destinations: [{ destination: '', days: 1 }] as DestinationStop[],
    hotelCategory: 'Standard',
    transportType: 'Private',
    budget: '',
    specialRequirements: '',
    name: '',
    email: '',
    phone: '',
  });

  const addDestination = () => {
    setTripData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { destination: '', days: 1 }]
    }));
  };

  const removeDestination = (index: number) => {
    if (tripData.destinations.length > 1) {
      setTripData(prev => ({
        ...prev,
        destinations: prev.destinations.filter((_, i) => i !== index)
      }));
    }
  };

  const updateDestination = (index: number, field: 'destination' | 'days', value: string | number) => {
    setTripData(prev => ({
      ...prev,
      destinations: prev.destinations.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      )
    }));
  };

  const calculateDays = () => {
    if (!tripData.startDate || !tripData.endDate) return 0;
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const estimateBudget = () => {
    const days = calculateDays();
    const travelers = tripData.adults + tripData.children;
    let perDayPerPerson = 2500;
    if (tripData.hotelCategory === 'Deluxe') perDayPerPerson = 4000;
    if (tripData.hotelCategory === 'Luxury') perDayPerPerson = 6000;
    if (tripData.hotelCategory === 'Budget') perDayPerPerson = 1500;

    const accommodation = days * travelers * perDayPerPerson;
    const transport = tripData.transportType === 'Private' ? days * 3500 : days * 1500 * travelers;
    const activities = days * travelers * 500;

    return accommodation + transport + activities;
  };

  const handleSubmit = async () => {
    if (!tripData.name || !tripData.email || !tripData.phone) {
      error('Please fill in all contact details');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTripPlanner({
        ...tripData,
        destinations: tripData.destinations.filter(d => d.destination),
      });
      success('Trip request submitted successfully! Our team will contact you within 24 hours.');
      setStep(4);
    } catch (err) {
      error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Trip Planner"
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
              Plan Your Custom Trip
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              Let us create your perfect Northeast adventure
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3, 4].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded transition-colors ${
                    step > s ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex gap-4 md:gap-8 text-sm">
              <span className={step >= 1 ? 'text-primary-500 font-medium' : 'text-surface-400'}>Trip Details</span>
              <span className={step >= 2 ? 'text-primary-500 font-medium' : 'text-surface-400'}>Preferences</span>
              <span className={step >= 3 ? 'text-primary-500 font-medium' : 'text-surface-400'}>Contact</span>
              <span className={step >= 4 ? 'text-primary-500 font-medium' : 'text-surface-400'}>Done</span>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 md:p-8"
          >
            {/* Step 1: Trip Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">
                  Tell us about your trip
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={tripData.startDate}
                      onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Date *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={tripData.endDate}
                      onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                      min={tripData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Adults *
                    </label>
                    <select
                      className="input-field"
                      value={tripData.adults}
                      onChange={(e) => setTripData({ ...tripData, adults: parseInt(e.target.value) })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Children (5-12 years)
                    </label>
                    <select
                      className="input-field"
                      value={tripData.children}
                      onChange={(e) => setTripData({ ...tripData, children: parseInt(e.target.value) })}
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                    Destinations to Visit *
                  </label>
                  <div className="space-y-3">
                    {tripData.destinations.map((dest, index) => (
                      <div key={index} className="flex gap-3">
                        <select
                          className="flex-1 input-field"
                          value={dest.destination}
                          onChange={(e) => updateDestination(index, 'destination', e.target.value)}
                        >
                          <option value="">Select destination</option>
                          {destinations.map(d => (
                            <option key={d.id} value={d.id}>{d.name}, {d.state}</option>
                          ))}
                        </select>
                        <select
                          className="w-24 input-field"
                          value={dest.days}
                          onChange={(e) => updateDestination(index, 'days', parseInt(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map(n => (
                            <option key={n} value={n}>{n} days</option>
                          ))}
                        </select>
                        {tripData.destinations.length > 1 && (
                          <button
                            onClick={() => removeDestination(index)}
                            className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addDestination}
                    className="mt-3 flex items-center gap-2 text-primary-500 hover:text-primary-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add another destination
                  </button>
                </div>

                {calculateDays() > 0 && (
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Total Trip Duration: <strong>{calculateDays()} days</strong> |
                      Estimated Budget: <strong>Rs {estimateBudget().toLocaleString('en-IN')}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">
                  Customize your preferences
                </h2>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                    <Hotel className="w-4 h-4 inline mr-1" />
                    Hotel Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Budget', 'Standard', 'Deluxe', 'Luxury'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setTripData({ ...tripData, hotelCategory: cat })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          tripData.hotelCategory === cat
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-primary-300'
                        }`}
                      >
                        <p className="font-semibold text-surface-900 dark:text-white">{cat}</p>
                        <p className="text-sm text-surface-500 mt-1">
                          {cat === 'Budget' && 'Rs 1500-2500/night'}
                          {cat === 'Standard' && 'Rs 2500-4000/night'}
                          {cat === 'Deluxe' && 'Rs 4000-8000/night'}
                          {cat === 'Luxury' && 'Rs 8000+/night'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                    <Car className="w-4 h-4 inline mr-1" />
                    Transport Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { type: 'Private', desc: 'Dedicated vehicle with driver', icon: '🚗' },
                      { type: 'Shared', desc: 'Shared transport with other travelers', icon: '🚌' },
                      { type: 'Self-Drive', desc: 'Rent a vehicle and drive yourself', icon: '🚙' },
                    ].map(opt => (
                      <button
                        key={opt.type}
                        onClick={() => setTripData({ ...tripData, transportType: opt.type })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          tripData.transportType === opt.type
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-primary-300'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <p className="font-semibold text-surface-900 dark:text-white mt-2">{opt.type}</p>
                        <p className="text-sm text-surface-500">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    <Calculator className="w-4 h-4 inline mr-1" />
                    Your Budget (Optional)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Enter your budget"
                    value={tripData.budget}
                    onChange={(e) => setTripData({ ...tripData, budget: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    className="input-field h-24 resize-none"
                    placeholder="Any special requirements, dietary restrictions, accessibility needs..."
                    value={tripData.specialRequirements}
                    onChange={(e) => setTripData({ ...tripData, specialRequirements: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">
                  Your contact details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Your full name"
                      value={tripData.name}
                      onChange={(e) => setTripData({ ...tripData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="your@email.com"
                      value={tripData.email}
                      onChange={(e) => setTripData({ ...tripData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+91 98765 43210"
                      value={tripData.phone}
                      onChange={(e) => setTripData({ ...tripData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3">Trip Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Duration:</strong> {calculateDays()} days</p>
                    <p><strong>Travelers:</strong> {tripData.adults} adults{tripData.children > 0 && `, ${tripData.children} children`}</p>
                    <p><strong>Destinations:</strong> {tripData.destinations.filter(d => d.destination).map(d => destinations.find(dest => dest.id === d.destination)?.name).filter(Boolean).join(', ') || 'Not specified'}</p>
                    <p><strong>Hotel:</strong> {tripData.hotelCategory}</p>
                    <p><strong>Transport:</strong> {tripData.transportType}</p>
                    <p><strong>Est. Budget:</strong> Rs {estimateBudget().toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Submitted */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
                  Trip Request Submitted!
                </h2>
                <p className="text-surface-500 mb-6 max-w-md mx-auto">
                  Our travel experts will review your request and contact you within 24 hours with a customized itinerary.
                </p>
                <Button variant="primary" onClick={() => navigate('/destinations')}>
                  Explore More Destinations
                </Button>
              </div>
            )}

            {/* Navigation */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-200 dark:border-surface-800">
                {step > 1 && (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    variant="primary"
                    className="ml-auto"
                    onClick={() => setStep(step + 1)}
                    disabled={!tripData.startDate || !tripData.endDate}
                  >
                    Continue
                  </Button>
                ) : step === 3 ? (
                  <Button
                    variant="primary"
                    className="ml-auto"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                ) : null}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
