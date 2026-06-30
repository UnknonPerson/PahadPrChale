import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Mountain, CircleCheck as CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'text-red-500' };
    if (password.length < 8) return { strength: 2, label: 'Fair', color: 'text-yellow-500' };
    if (password.length < 12) return { strength: 3, label: 'Good', color: 'text-green-500' };
    return { strength: 4, label: 'Strong', color: 'text-emerald-500' };
  };

  const { strength, label, color } = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      success('Password reset successfully');
    } catch (err) {
      error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
              Password Reset Successfully
            </h1>
            <p className="text-surface-500 mb-6">
              Your password has been reset. You can now log in with your new password.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Continue to Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-surface-900 dark:text-white">
                PahadPer<span className="text-primary-500">Chale</span>
              </span>
            </Link>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
                Reset Your Password
              </h1>
              <p className="text-surface-500">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-12 pr-12"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strength === 1 ? 'w-1/4 bg-red-500' :
                          strength === 2 ? 'w-2/4 bg-yellow-500' :
                          strength === 3 ? 'w-3/4 bg-green-500' :
                          strength === 4 ? 'w-full bg-emerald-500' : 'w-0'
                        }`}
                      />
                    </div>
                    <span className={`text-xs ${color}`}>{label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-field pl-12 pr-12"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-1 text-green-500 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    Passwords match
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.776 3.906 2.053 5.316l2-2.025z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-surface-600 dark:text-surface-400 hover:text-primary-500 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
