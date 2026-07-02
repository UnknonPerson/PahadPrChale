import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, ShieldCheck, TriangleAlert as AlertTriangle, Camera, LogOut, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/ui/ImageUpload';
import EmailVerificationModal from '../components/ui/EmailVerificationModal';
import authService from '../services/authService';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState((user as any)?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const isVerified = (user as any)?.isEmailVerified;
  const avatarSrc = (user as any)?.profileImage || user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10B981&color=fff&size=128`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { error('Name is required'); return; }
    setSaving(true);
    const result = await updateProfile({ name, phone });
    if (result.success) success('Profile updated');
    else error(result.message || 'Failed to update profile');
    setSaving(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const res = await authService.updateProfile(formData) as any;
      const newUser = res?.data?.user || res?.user || res;
      if (newUser?.profileImage) {
        await updateProfile({ profileImage: newUser.profileImage } as any);
      }
      success('Profile photo updated');
    } catch {
      error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) { error('All fields are required'); return; }
    if (newPassword !== confirmPassword) { error('Passwords do not match'); return; }
    if (newPassword.length < 6) { error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      success('Password changed successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account settings and personal information</p>
        </div>

        {/* Email verification banner */}
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50 rounded-xl"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Your email is not verified.
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 hidden sm:block">
                Verify your email before booking trips or using protected features.
              </p>
            </div>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-300 dark:hover:bg-amber-700/60 transition-colors"
            >
              Verify Email
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Sidebar: Profile Card ── */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center"
            >
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <ImageUpload
                  shape="circle"
                  current={avatarSrc}
                  onUpload={handleImageUpload}
                  uploading={uploadingImage}
                  label="Change avatar"
                  className="mx-auto"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center border-2 border-white dark:border-gray-900 pointer-events-none">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user?.email}</p>

              <div className="flex items-center justify-center gap-2 mt-3">
                <span className={`badge ${isVerified ? 'badge-green' : 'badge-yellow'}`}>
                  {isVerified ? <><ShieldCheck className="w-3 h-3" /> Verified</> : <><AlertTriangle className="w-3 h-3" /> Unverified</>}
                </span>
                <span className="badge badge-primary capitalize">{(user as any)?.role || 'User'}</span>
              </div>

              {(user as any)?.lastLogin && (
                <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Last login: {new Date((user as any).lastLogin).toLocaleDateString('en-IN')}
                </p>
              )}
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="glass-card p-4 space-y-1"
            >
              {[
                { to: '/bookings/my', label: 'My Bookings' },
                { to: '/my-custom-tours', label: 'My Custom Tours' },
                { to: '/my-messages', label: 'My Messages' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {label}
                  <span className="text-gray-400">›</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.div>
          </div>

          {/* ── Main: Forms ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />Personal Information
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      className="input-field" placeholder="Your name" required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="input-field" placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email" value={user?.email || ''} readOnly
                        className="input-field pl-9 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email address cannot be changed</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving
                      ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                      : <><Save className="w-4 h-4" />Save Changes</>
                    }
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-500" />Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { label: 'Current Password', val: currentPassword, set: setCurrentPassword },
                  { label: 'New Password',      val: newPassword,     set: setNewPassword },
                  { label: 'Confirm Password',  val: confirmPassword, set: setConfirmPassword },
                ].map(({ label, val, set }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={val} onChange={e => set(e.target.value)}
                        className="input-field pl-9 pr-10" placeholder="••••••••" required
                      />
                      {label === 'Current Password' && (
                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={changingPassword} className="btn-primary">
                    {changingPassword
                      ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating...</>
                      : <><Lock className="w-4 h-4" />Update Password</>
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        actionName="use protected features like bookings and reviews"
      />
    </div>
  );
}
