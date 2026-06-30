import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const colors = {
  primary: 'border-primary-500',
  secondary: 'border-secondary-500',
  white: 'border-white',
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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto rounded-full border-4 border-t-primary-500 border-r-secondary-500 border-b-accent-500 border-l-transparent"
        />
        <p className="mt-4 text-surface-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function ButtonLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={`w-5 h-5 rounded-full border-2 border-t-white border-r-white/50 border-b-white/25 border-l-transparent ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
      <div className="h-48 shimmer skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 shimmer skeleton rounded" />
        <div className="h-4 w-1/2 shimmer skeleton rounded" />
        <div className="h-4 w-full shimmer skeleton rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-20 shimmer skeleton rounded" />
          <div className="h-8 w-24 shimmer skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800">
          <div className="w-12 h-12 shimmer skeleton rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 shimmer skeleton rounded" />
            <div className="h-3 w-1/2 shimmer skeleton rounded" />
          </div>
          <div className="h-8 w-20 shimmer skeleton rounded" />
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
          className="h-4 shimmer skeleton rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}
