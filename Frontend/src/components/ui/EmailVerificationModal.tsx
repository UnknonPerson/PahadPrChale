import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck, X, Send, Loader, CircleCheck as CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName?: string; // e.g. "make a booking", "post a review"
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  actionName = 'perform this action',
}: EmailVerificationModalProps) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (!user?.email || cooldown > 0) return;
    setSending(true);
    try {
      await authService.resendVerification(user.email);
      setSent(true);
      success('Verification email sent! Check your inbox.');
      // 60s cooldown
      let seconds = 60;
      setCooldown(seconds);
      const interval = setInterval(() => {
        seconds -= 1;
        setCooldown(seconds);
        if (seconds <= 0) clearInterval(interval);
      }, 1000);
    } catch (err: any) {
      error(err?.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-7 border border-gray-200 dark:border-gray-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                You need to verify your email address to{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{actionName}</span>.
                We sent a verification link to{' '}
                <span className="font-medium text-primary-600 dark:text-primary-400">{user?.email}</span>.
              </p>

              {sent ? (
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm mb-4">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Verification email sent! Check your inbox and spam folder.
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleResend}
                  disabled={sending || cooldown > 0}
                  className="btn-primary w-full justify-center"
                >
                  {sending ? (
                    <><Loader className="w-4 h-4 animate-spin" />Sending...</>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    <><Send className="w-4 h-4" />{sent ? 'Resend Email' : 'Send Verification Email'}</>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="btn-ghost w-full justify-center text-gray-500"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Already verified?{' '}
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary-500 hover:underline"
                >
                  Refresh the page
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
