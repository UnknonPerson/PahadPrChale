import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mountain, Mail, ArrowLeft, Send, CircleCheck as CheckCircle } from 'lucide-react';
import authService from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true); setError('');
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                PahadPer<span className="text-primary-500">Chale</span>
              </span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your email and we'll send you a reset link.</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            {sent ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                </p>
                <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl">
                  <ArrowLeft className="w-4 h-4" />Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" placeholder="your@email.com" required />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <><span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />Sending...</> : <><Send className="w-4 h-4" />Send Reset Link</>}
                </button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-primary-500 transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" />Back to Login
                </Link>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
