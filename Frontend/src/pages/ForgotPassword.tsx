import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Mountain, Send, CircleCheck as CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      success('Password reset instructions sent to your email');
    } catch (err) {
      error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
                  Check Your Email
                </h1>
                <p className="text-surface-500 mb-6">
                  We&apos;ve sent password reset instructions to <strong className="text-surface-700 dark:text-surface-300">{email}</strong>
                </p>
                <p className="text-sm text-surface-400 mb-6">
                  Didn&apos;t receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary-500 font-medium hover:text-primary-600"
                >
                  Try another email address
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-surface-500">
                    No worries! Enter your email and we&apos;ll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type="email"
                        className="input-field pl-12"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
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
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Reset Link
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-primary-500 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
