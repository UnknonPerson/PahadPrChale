import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, File as FileJson, FileSpreadsheet, ChevronDown } from 'lucide-react';

type ExportFormat = 'csv' | 'json';
type ExportType = 'bookings' | 'customers' | 'packages' | 'hotels' | 'vehicles' | 'messages' | 'customTours' | 'activities';

interface ExportButtonProps {
  type: ExportType;
  data: any[];
  className?: string;
}

const exportFunctions: Record<ExportType, (data: any[], format: ExportFormat) => void> = {
  bookings: (data, format) => {
    const { exportBookings } = require('../../utils/export');
    exportBookings(data, format);
  },
  customers: (data, format) => {
    const { exportCustomers } = require('../../utils/export');
    exportCustomers(data, format);
  },
  packages: (data, format) => {
    const { exportPackages } = require('../../utils/export');
    exportPackages(data, format);
  },
  hotels: (data, format) => {
    const { exportHotels } = require('../../utils/export');
    exportHotels(data, format);
  },
  vehicles: (data, format) => {
    const { exportVehicles } = require('../../utils/export');
    exportVehicles(data, format);
  },
  messages: (data, format) => {
    const { exportMessages } = require('../../utils/export');
    exportMessages(data, format);
  },
  customTours: (data, format) => {
    const { exportCustomTours } = require('../../utils/export');
    exportCustomTours(data, format);
  },
  activities: (data, format) => {
    const { exportActivities } = require('../../utils/export');
    exportActivities(data, format);
  },
};

export default function ExportButton({ type, data, className = '' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: ExportFormat) => {
    setIsOpen(false);
    try {
      exportFunctions[type](data, format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${className}`}
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Export as CSV</p>
                <p className="text-xs text-gray-500">Opens in Excel, Google Sheets</p>
              </div>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileJson className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Export as JSON</p>
                <p className="text-xs text-gray-500">For developers, raw data</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
