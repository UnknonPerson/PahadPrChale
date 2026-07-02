import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mountain, CircleCheck as CheckCircle, Circle as XCircle, Loader } from 'lucide-react';
import authService from '../services/authService';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    authService.verifyEmail(token)
      .then((res: any) => {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'This verification link is invalid or has expired.');
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10 max-w-md w-full text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-gray-900 dark:text-white">PahadPerChale</span>
        </Link>

        {status === 'loading' && (
          <div>
            <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Verifying your email...</h1>
            <p className="text-gray-500 mt-2">Please wait a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <p className="text-sm text-gray-400 mb-4">Redirecting to login in 3 seconds...</p>
            <Link to="/login" className="btn-primary inline-block px-6 py-2 rounded-xl">Go to Login</Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <Link to="/login" className="block w-full py-2.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors">Go to Login</Link>
              <p className="text-sm text-gray-500">
                Need a new link?{' '}
                <Link to="/resend-verification" className="text-primary-500 hover:underline">Resend verification email</Link>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
