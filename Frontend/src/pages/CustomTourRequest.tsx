import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MapPin, Calendar, Users, IndianRupee, Car,
  UtensilsCrossed, Send, CircleAlert as AlertCircle,
  Check, ChevronRight, ChevronLeft, X,
} from 'lucide-react';
import { useDestinations } from '../hooks/useDestinations';
import { useCustomTourActions } from '../hooks/useCustomTours';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ACTIVITIES = [
  'Trekking', 'River Rafting', 'Paragliding', 'Wildlife Safari',
  'Monastery Visits', 'Tea Garden Tour', 'Cable Car Ride', 'Camping',
  'Bird Watching', 'Photography Tours', 'Cultural Shows', 'Local Market Tours',
];

// ─── Validation ────────────────────────────────────────────────────────────

interface FormData {
  destinations: string[];
  customDestination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  budget: string;
  budgetType: string;
  accommodationType: string;
  transportation: string;
  meals: string;
  activities: string[];
  pickupLocation: string;
  specialRequests: string;
  contactPhone: string;
  contactEmail: string;
}

interface FormErrors {
  destinations?: string;
  startDate?: string;
  endDate?: string;
  adults?: string;
  budget?: string;
  contactPhone?: string;
  contactEmail?: string;
}

function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (step === 1) {
    if (data.destinations.length === 0 && !data.customDestination.trim()) {
      errors.destinations = 'Please select at least one destination or enter a custom one.';
    }
    if (!data.startDate) {
      errors.startDate = 'Start date is required.';
    }
    if (!data.endDate) {
      errors.endDate = 'End date is required.';
    } else if (data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
      errors.endDate = 'End date must be after start date.';
    }
  }
  if (step === 2) {
    if (!data.adults || data.adults < 1) {
      errors.adults = 'At least 1 adult is required.';
    }
    if (!data.budget.trim()) {
      errors.budget = 'Please enter your approximate budget.';
    } else if (isNaN(Number(data.budget)) || Number(data.budget) <= 0) {
      errors.budget = 'Budget must be a positive number.';
    }
  }
  if (step === 4) {
    if (!data.contactPhone.trim()) {
      errors.contactPhone = 'Phone number is required.';
    } else if (!/^[+\d\s\-()]{7,}$/.test(data.contactPhone.trim())) {
      errors.contactPhone = 'Enter a valid phone number.';
    }
    if (!data.contactEmail.trim()) {
      errors.contactEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail.trim())) {
      errors.contactEmail = 'Enter a valid email address.';
    }
  }
  return errors;
}

// ─── Field error component ──────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 text-xs text-red-500 mt-1"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{msg}
    </motion.p>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CustomTourRequest() {
  const { destinations } = useDestinations();
  const { create } = useCustomTourActions();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]         = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [touched, setTouched]   = useState(false);

  const [formData, setFormData] = useState<FormData>({
    destinations: [],
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
    activities: [],
    pickupLocation: '',
    specialRequests: '',
    contactPhone: '',
    contactEmail: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactPhone: user.phone || prev.contactPhone,
        contactEmail: user.email || prev.contactEmail,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/custom-tour-request' } }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  // Live validate current step when touched
  const currentErrors = touched ? validateStep(step, formData) : {};
  const isStepValid   = Object.keys(currentErrors).length === 0;

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched) setErrors(validateStep(step, { ...formData, [field]: value }));
  };

  const toggleDestination = (id: string) => {
    const next = formData.destinations.includes(id)
      ? formData.destinations.filter((d) => d !== id)
      : [...formData.destinations, id];
    updateField('destinations', next);
  };

  const toggleActivity = (act: string) => {
    const next = formData.activities.includes(act)
      ? formData.activities.filter((a) => a !== act)
      : [...formData.activities, act];
    updateField('activities', next);
  };

  const goNext = () => {
    setTouched(true);
    const errs = validateStep(step, formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setTouched(false);
    setErrors({});
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setTouched(false);
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setTouched(true);
    const errs = validateStep(4, formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
        duration: formData.startDate && formData.endDate
          ? Math.max(1, Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000))
          : undefined,
      };
      const res = await create(payload);
      const id = res?.data?._id || res?.data?.id || res?._id || 'submitted';
      setSuccessId(id);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  // ── Success screen ───────────────────────────────────────────────────────

  if (successId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Our team will review your custom tour request and reach out within 24–48 hours.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setSuccessId(null); setStep(1); setFormData({ destinations: [], customDestination: '', startDate: '', endDate: '', adults: 1, children: 0, budget: '', budgetType: 'per_person', accommodationType: 'standard', transportation: 'car', meals: 'breakfast', activities: [], pickupLocation: '', specialRequests: '', contactPhone: user?.phone || '', contactEmail: user?.email || '' }); }}
              className="flex-1 btn-outline py-2.5"
            >
              New Request
            </button>
            <button onClick={() => navigate('/my-custom-tours')} className="flex-1 btn-primary py-2.5">
              View Requests
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  const STEP_LABELS = ['Destinations & Dates', 'Travelers & Budget', 'Preferences', 'Contact & Review'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Plan Your Custom Tour
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Tell us your dream trip and we'll craft it just for you.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-1">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex flex-col items-center gap-1 ${i < 3 ? 'min-w-[70px]' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-primary-500 text-white'
                  : step === i + 1 ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] text-center leading-tight hidden sm:block ${step === i + 1 ? 'text-primary-500 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < 3 && <div className={`h-0.5 w-8 sm:w-12 mx-1 rounded mb-4 transition-colors ${step > i + 1 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Step {step}: {STEP_LABELS[step - 1]}
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Destinations & Dates ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Destinations <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {destinations.map((d: any) => {
                        const id = d._id || d.id;
                        const selected = formData.destinations.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleDestination(id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${
                              selected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            {d.name}
                            {selected && <X className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={formData.customDestination}
                      onChange={(e) => updateField('customDestination', e.target.value)}
                      className={`input-field ${(currentErrors.destinations && !formData.destinations.length && !formData.customDestination) ? 'input-error' : ''}`}
                      placeholder="Or enter a custom destination…"
                    />
                    <FieldError msg={currentErrors.destinations} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          min={minDate}
                          value={formData.startDate}
                          onChange={(e) => updateField('startDate', e.target.value)}
                          className={`input-field pl-9 ${currentErrors.startDate ? 'input-error' : ''}`}
                        />
                      </div>
                      <FieldError msg={currentErrors.startDate} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          min={formData.startDate || minDate}
                          value={formData.endDate}
                          onChange={(e) => updateField('endDate', e.target.value)}
                          className={`input-field pl-9 ${currentErrors.endDate ? 'input-error' : ''}`}
                        />
                      </div>
                      <FieldError msg={currentErrors.endDate} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Travelers & Budget ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Adults <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={formData.adults}
                          onChange={(e) => updateField('adults', Math.max(1, Number(e.target.value)))}
                          className={`input-field pl-9 ${currentErrors.adults ? 'input-error' : ''}`}
                        />
                      </div>
                      <FieldError msg={currentErrors.adults} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Children</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={formData.children}
                          onChange={(e) => updateField('children', Math.max(0, Number(e.target.value)))}
                          className="input-field pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Budget (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="number"
                          min={1}
                          value={formData.budget}
                          onChange={(e) => updateField('budget', e.target.value)}
                          className={`input-field pl-9 ${currentErrors.budget ? 'input-error' : ''}`}
                          placeholder="e.g. 25000"
                        />
                      </div>
                      <select
                        value={formData.budgetType}
                        onChange={(e) => updateField('budgetType', e.target.value)}
                        className="input-field w-auto"
                      >
                        <option value="per_person">Per Person</option>
                        <option value="total">Total</option>
                      </select>
                    </div>
                    <FieldError msg={currentErrors.budget} />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Preferences ── */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Accommodation</label>
                      <select value={formData.accommodationType} onChange={(e) => updateField('accommodationType', e.target.value)} className="input-field">
                        <option value="budget">Budget</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="luxury">Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transportation</label>
                      <select value={formData.transportation} onChange={(e) => updateField('transportation', e.target.value)} className="input-field">
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="flight">Flight</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meals</label>
                      <select value={formData.meals} onChange={(e) => updateField('meals', e.target.value)} className="input-field">
                        <option value="none">No meals</option>
                        <option value="breakfast">Breakfast only</option>
                        <option value="half_board">Half board</option>
                        <option value="full_board">Full board</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activities (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITIES.map((act) => {
                        const selected = formData.activities.includes(act);
                        return (
                          <button
                            key={act}
                            type="button"
                            onClick={() => toggleActivity(act)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${
                              selected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                            }`}
                          >
                            {act}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Contact & Review ── */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => updateField('contactPhone', e.target.value)}
                        className={`input-field ${currentErrors.contactPhone ? 'input-error' : ''}`}
                        placeholder="+91 98765 43210"
                      />
                      <FieldError msg={currentErrors.contactPhone} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => updateField('contactEmail', e.target.value)}
                        className={`input-field ${currentErrors.contactEmail ? 'input-error' : ''}`}
                        placeholder="you@email.com"
                      />
                      <FieldError msg={currentErrors.contactEmail} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pickup Location</label>
                    <input
                      type="text"
                      value={formData.pickupLocation}
                      onChange={(e) => updateField('pickupLocation', e.target.value)}
                      className="input-field"
                      placeholder="Airport, hotel, or address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Special Requests</label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => updateField('specialRequests', e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Dietary requirements, accessibility needs, any special preferences…"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Destinations</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formData.destinations.length > 0
                          ? destinations.filter((d: any) => formData.destinations.includes(d._id || d.id)).map((d: any) => d.name).join(', ')
                          : formData.customDestination || '—'}
                      </span>
                      <span className="text-gray-500">Dates</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formData.startDate && formData.endDate
                          ? `${new Date(formData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(formData.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : '—'}
                      </span>
                      <span className="text-gray-500">Travelers</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formData.adults} adult{formData.adults > 1 ? 's' : ''}{formData.children > 0 ? `, ${formData.children} child${formData.children > 1 ? 'ren' : ''}` : ''}</span>
                      <span className="text-gray-500">Budget</span>
                      <span className="text-gray-900 dark:text-white font-medium">₹{Number(formData.budget || 0).toLocaleString('en-IN')} ({formData.budgetType === 'per_person' ? 'per person' : 'total'})</span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{submitError}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="button"
              onClick={step === 1 ? () => navigate('/') : goBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Back to Home' : 'Back'}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 btn-primary"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 btn-primary min-w-[140px] justify-center"
              >
                {isSubmitting
                  ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
                  : <><Send className="w-4 h-4" />Submit Request</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
