import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, IndianRupee, Car, Hop as Home, UtensilsCrossed, Send, CircleAlert as AlertCircle, Check } from 'lucide-react';
import { useDestinations } from '../hooks/useDestinations';
import { useCustomTourActions } from '../hooks/useCustomTours';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const activityOptions = [
  'Trekking', 'River Rafting', 'Paragliding', 'Wildlife Safari', 'Monastery Visits',
  'Tea Garden Tour', 'Cable Car Ride', 'Camping', 'Bird Watching', 'Photography Tours',
  'Cultural Shows', 'Local Market Tours',
];

export default function CustomTourRequest() {
  const { destinations } = useDestinations();
  const { create } = useCustomTourActions();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // All hooks must be called before any early returns
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    destinations: [] as string[],
    customDestination: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    budget: '',
    budgetType: 'per_person',
    accommodationType: 'standard',
    transportation: 'car',
    meals: 'breakfast',
    activities: [] as string[],
    pickupLocation: '',
    specialRequests: '',
    contactPhone: '',
    contactEmail: '',
  });

  // Update contact info when user loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactPhone: user.phone || prev.contactPhone,
        contactEmail: user.email || prev.contactEmail,
      }));
    }
  }, [user]);

  // Redirect if not authenticated (after all hooks)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/custom-tour-request' } }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleDestinationToggle = (dest: string) => {
    setFormData((prev) => {
      const exists = prev.destinations.includes(dest);
      return { ...prev, destinations: exists ? prev.destinations.filter((d) => d !== dest) : [...prev.destinations, dest] };
    });
  };

  const handleActivityToggle = (activity: string) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(activity);
      return { ...prev, activities: exists ? prev.activities.filter((a) => a !== activity) : [...prev.activities, activity] };
    });
  };

  const handleSubmit = async () => {
    if (formData.destinations.length === 0 && !formData.customDestination) {
      setError('Please select at least one destination'); return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError('Please select travel dates'); return;
    }
    if (!formData.budget) {
      setError('Please enter your budget'); return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      const data = {
        destinations: [...formData.destinations, formData.customDestination].filter(Boolean),
        startDate: formData.startDate,
        endDate: formData.endDate,
        adults: formData.adults,
        children: formData.children,
        budget: parseFloat(formData.budget),
        budgetType: formData.budgetType,
        accommodationType: formData.accommodationType,
        transportation: formData.transportation,
        meals: formData.meals,
        activities: formData.activities,
        pickupLocation: formData.pickupLocation,
        specialRequests: formData.specialRequests,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
      };
      await create(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We've received your custom tour request. Our team will get back to you within 24-48 hours.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSuccess(false);
                setStep(1);
                setFormData({ destinations: [], customDestination: '', startDate: '', endDate: '', adults: 1, children: 0, budget: '', budgetType: 'per_person', accommodationType: 'standard', transportation: 'car', meals: 'breakfast', activities: [], pickupLocation: '', specialRequests: '', contactPhone: user?.phone || '', contactEmail: user?.email || '' });
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Create Another
            </button>
            <button onClick={() => navigate('/my-custom-tours')} className="flex-1 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600">
              View My Requests
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Customize Your Tour</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Let us create the perfect personalized travel experience for you</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-16 h-1 mx-2 transition-colors ${step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {/* Step 1: Destinations & Dates */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />Where do you want to go?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {destinations.map((dest: any) => (
                    <button
                      key={dest._id || dest.id}
                      onClick={() => handleDestinationToggle(dest.name)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.destinations.includes(dest.name)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'
                      }`}
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{dest.name}</p>
                      <p className="text-sm text-gray-500">{dest.state}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or specify your own destination</label>
                  <input type="text" placeholder="Enter destination name" value={formData.customDestination} onChange={(e) => setFormData({ ...formData, customDestination: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />When do you want to travel?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} min={new Date().toISOString().split('T')[0]} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} min={formData.startDate || new Date().toISOString().split('T')[0]} className="input-field" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Travelers & Budget */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />How many travelers?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adults *</label>
                    <input type="number" value={formData.adults} onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })} min={1} max={20} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Children</label>
                    <input type="number" value={formData.children} onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })} min={0} max={10} className="input-field" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary-500" />What's your budget?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget (INR) *</label>
                    <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} placeholder="Enter amount" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Type</label>
                    <select value={formData.budgetType} onChange={(e) => setFormData({ ...formData, budgetType: e.target.value })} className="input-field">
                      <option value="per_person">Per Person</option>
                      <option value="total">Total Trip</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary-500" />Accommodation
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['budget', 'standard', 'premium', 'luxury'].map((type) => (
                    <button key={type} onClick={() => setFormData({ ...formData, accommodationType: type })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${formData.accommodationType === type ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'}`}>
                      <p className="font-medium capitalize text-gray-900 dark:text-white">{type}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary-500" />Transportation
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['flight', 'train', 'bus', 'car', 'mixed'].map((type) => (
                    <button key={type} onClick={() => setFormData({ ...formData, transportation: type })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${formData.transportation === type ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'}`}>
                      <p className="font-medium capitalize text-gray-900 dark:text-white">{type}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary-500" />Meals
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['none', 'breakfast', 'half_board', 'full_board'].map((type) => (
                    <button key={type} onClick={() => setFormData({ ...formData, meals: type })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${formData.meals === type ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-200'}`}>
                      <p className="font-medium capitalize text-gray-900 dark:text-white">{type.replace('_', ' ')}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activities (Optional)</h2>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.map((activity) => (
                    <button key={activity} onClick={() => handleActivityToggle(activity)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.activities.includes(activity) ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact & Submit */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} className="input-field" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pickup Location</label>
                  <input type="text" value={formData.pickupLocation} onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })} placeholder="Airport, Hotel, or specific address" className="input-field" />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                  <textarea value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} placeholder="Any special requirements or preferences..." rows={4} className="input-field resize-none" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Request Summary</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Destinations:</span> {[...formData.destinations, formData.customDestination].filter(Boolean).join(', ') || 'Not specified'}</p>
                  <p><span className="font-medium">Dates:</span> {formData.startDate || 'Not set'} to {formData.endDate || 'Not set'}</p>
                  <p><span className="font-medium">Travelers:</span> {formData.adults} adult(s), {formData.children} child(ren)</p>
                  <p><span className="font-medium">Budget:</span> ₹{formData.budget || '0'} {formData.budgetType === 'per_person' ? 'per person' : 'total'}</p>
                  <p><span className="font-medium">Accommodation:</span> {formData.accommodationType}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200">
                Previous
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </span>
                ) : (
                  <><Send className="w-4 h-4" />Submit Request</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
