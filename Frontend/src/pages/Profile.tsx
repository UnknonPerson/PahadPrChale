import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard as Edit2, Camera, Save, Lock, Bell, Heart, Calendar, Trash2, ChevronRight, Eye, EyeOff, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { PageLoader, ButtonLoader } from '../components/ui/LoadingSpinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import authService from '../services/authService';

type TabType = 'profile' | 'security' | 'notifications' | 'danger';

export default function Profile() {
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const { itemCount } = useWishlist();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailBooking: true,
    emailOffers: true,
    smsUpdates: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        bio: '',
      });
    }
  }, [user]);

  if (!user) {
    return <PageLoader />;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
      });
      success('Profile updated successfully');
    } catch (err) {
      error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      success('Notification preferences updated');
    } catch (err) {
      error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await authService.deleteAccount();
      success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (err) {
      error('Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      success('Avatar updated successfully');
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'danger' as const, label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff&size=128`}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-primary-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{user.name}</h2>
                <p className="text-white/80">{user.email}</p>
              </div>

              {/* Quick Stats */}
              <div className="p-4 space-y-1">
                <Link
                  to="/bookings/my"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span className="text-surface-700 dark:text-surface-300">My Bookings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-400" />
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-surface-700 dark:text-surface-300">Wishlist</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 text-xs font-medium">
                    {itemCount}
                  </span>
                </Link>
              </div>

              {/* Navigation Tabs */}
              <nav className="p-4 border-t border-surface-200 dark:border-surface-800">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-500/10 text-primary-500'
                            : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white">
                      Profile Information
                    </h2>
                    <Edit2 className="w-5 h-5 text-surface-400" />
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                          <input
                            type="text"
                            className="input-field pl-12"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                          <input
                            type="email"
                            className="input-field pl-12"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                          <input
                            type="tel"
                            className="input-field pl-12"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                          <input
                            type="text"
                            className="input-field pl-12"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Your address"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        className="input-field h-24 resize-none"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                        {loading ? <ButtonLoader /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
                >
                  <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">
                    Change Password
                  </h2>

                  <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="input-field pl-12 pr-12"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="input-field pl-12 pr-12"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                        {loading ? <ButtonLoader /> : <Lock className="w-4 h-4" />}
                        Update Password
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-8 border-t border-surface-200 dark:border-surface-800">
                    <div className="flex items-center justify-between max-w-md">
                      <div>
                        <h3 className="font-semibold text-surface-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-surface-500">Add an extra layer of security to your account</p>
                      </div>
                      <button className="btn-outline text-sm py-2 px-4">Enable</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
                >
                  <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {[
                      { key: 'emailBooking', label: 'Booking Confirmations', desc: 'Receive emails for booking confirmations and updates' },
                      { key: 'emailOffers', label: 'Special Offers', desc: 'Get notified about special deals and discounts' },
                      { key: 'smsUpdates', label: 'SMS Updates', desc: 'Receive SMS for important booking updates' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                        <div>
                          <p className="font-medium text-surface-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-surface-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setNotifications(prev => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof notifications]
                            }));
                          }}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications]
                              ? 'bg-primary-500'
                              : 'bg-surface-300 dark:bg-surface-600'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                              notifications[item.key as keyof typeof notifications]
                                ? 'translate-x-8'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleNotificationUpdate}
                      className="btn-primary flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? <ButtonLoader /> : <Save className="w-4 h-4" />}
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <motion.div
                  key="danger"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-red-500/30 p-6"
                >
                  <h2 className="text-2xl font-display font-bold text-red-500 mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    Danger Zone
                  </h2>

                  <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      Once you delete your account, there is no going back. All your bookings, wishlist, and data will be permanently removed.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete My Account
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="Are you absolutely sure you want to delete your account? This action is irreversible and all your data will be permanently deleted."
          confirmText="Yes, Delete My Account"
          variant="danger"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
