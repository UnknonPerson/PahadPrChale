import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert as AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-primary-500 hover:bg-primary-600',
  };

  const iconStyles = {
    danger: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    info: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800 w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconStyles[variant]}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400">{message}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-surface-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-800">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  {cancelText}
                </Button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-xl text-white font-semibold transition-all ${variantStyles[variant]} disabled:opacity-50`}
                >
                  {isLoading ? 'Please wait...' : confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
