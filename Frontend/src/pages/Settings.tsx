import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  Save,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ButtonLoader } from '../components/ui/LoadingSpinner';

export default function UserSettings() {
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    sessionTimeout: '30',
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success('Settings saved successfully');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-8 h-8 text-primary-500" />
              <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">
                Settings
              </h1>
            </div>
            <p className="text-surface-500">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Appearance */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-surface-500">Switch between light and dark theme</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Regional */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Regional Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Language
                  </label>
                  <select
                    className="input-field"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Currency
                  </label>
                  <select
                    className="input-field"
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Timezone
                  </label>
                  <select
                    className="input-field"
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  >
                    <option value="Asia/Kolkata">IST (India)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive booking updates via email' },
                  { key: 'smsNotifications', icon: Smartphone, label: 'SMS Notifications', desc: 'Get important alerts via SMS' },
                  { key: 'pushNotifications', icon: Bell, label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'marketingEmails', icon: MessageSquare, label: 'Marketing Emails', desc: 'Receive offers and promotional content' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-surface-400" />
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-surface-500">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev]
                      }))}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        preferences[item.key as keyof typeof preferences]
                          ? 'bg-primary-500'
                          : 'bg-surface-300 dark:bg-surface-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences[item.key as keyof typeof preferences] ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-surface-400" />
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-surface-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({
                      ...prev,
                      twoFactorAuth: !prev.twoFactorAuth
                    }))}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      preferences.twoFactorAuth ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences.twoFactorAuth ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    className="input-field max-w-xs"
                    value={preferences.sessionTimeout}
                    onChange={(e) => setPreferences({ ...preferences, sessionTimeout: e.target.value })}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <ButtonLoader /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
