import { motion } from 'framer-motion';
import { Mountain } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
const colors = {
  primary:   'border-primary-500',
  secondary: 'border-secondary-500',
  white:     'border-white',
};

export default function LoadingSpinner({ size = 'md', color = 'primary', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`absolute inset-0 rounded-full border-2 border-t-transparent ${colors[color]}`}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <Mountain className="w-8 h-8 text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 mx-auto rounded-full border-2 border-t-primary-500 border-r-primary-300 border-b-transparent border-l-transparent"
        />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">Loading…</p>
      </div>
    </div>
  );
}

export function InlineLoader({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 rounded-full border-2 border-t-primary-500 border-transparent"
      />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export function ButtonLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={`w-4 h-4 rounded-full border-2 border-t-white border-r-white/50 border-b-white/25 border-l-transparent ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded-lg" />
        <div className="h-4 w-1/2 skeleton rounded-lg" />
        <div className="h-4 w-full skeleton rounded-lg" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-20 skeleton rounded-lg" />
          <div className="h-8 w-24 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="w-12 h-12 skeleton rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 skeleton rounded-lg" />
            <div className="h-3 w-1/2 skeleton rounded-lg" />
          </div>
          <div className="h-8 w-20 skeleton rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 skeleton rounded-lg"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
