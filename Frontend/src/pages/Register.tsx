import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Mountain, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setIsLoading(false);

    if (result.success) {
      setRegistered(true);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Account Created!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We've sent a verification email to <strong>{email}</strong>.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Please check your inbox and click the verification link before logging in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl"
          >
            Go to Login <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                PahadPer<span className="text-primary-500">Chale</span>
              </span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Start your Himalayan adventure today</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </motion.div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-12" placeholder="Your full name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-12" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12 pr-12" placeholder="Min. 6 characters" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pl-12" placeholder="Repeat your password" required />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.776 3.906 2.053 5.316l2-2.025z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign In</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
