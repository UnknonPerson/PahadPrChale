import { motion } from 'framer-motion';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="text-[200px] font-display font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-32 h-32 text-primary-500 animate-spin-slow" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4"
        >
          Oops! Lost in the Himalayas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto"
        >
          The page you&apos;re looking for has wandered off the beaten path.
          Let us guide you back to familiar trails.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
          <Link to="/packages">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5" />
              Explore Packages
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <p className="text-gray-400 text-sm">
            Looking for something specific?{' '}
            <Link to="/contact" className="text-primary-500 hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
