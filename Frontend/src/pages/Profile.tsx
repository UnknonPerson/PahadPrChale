import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/ui/ImageUpload';
import authService from '../services/authService';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [resendingVerification, setResendingVerification] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { error('Name is required'); return; }
    setSaving(true);
    const result = await updateProfile({ name, phone });
    if (result.success) success('Profile updated successfully');
    else error(result.message || 'Failed to update profile');
    setSaving(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const res = await authService.updateProfile(formData) as any;
      const userData = res?.data?.user || res?.user || res;
      await updateProfile({ profileImage: userData.profileImage });
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
    if (newPassword !== confirmPassword) { error('New passwords do not match'); return; }
    if (newPassword.length < 6) { error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      success('Password changed successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResendingVerification(true);
    try {
      await authService.resendVerification(user.email);
      success('Verification email sent. Check your inbox.');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
        </div>

        {/* Email verification banner */}
        {user && !(user as any).isEmailVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Email not verified</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-0.5">Verify your email to access all features.</p>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {resendingVerification ? <span className="inline-block animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" /> : <RefreshCw className="w-3 h-3" />}
              Resend Email
            </button>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Profile Photo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <ImageUpload
                shape="circle"
                current={user?.avatar || user?.profileImage}
                onUpload={handleImageUpload}
                uploading={uploadingImage}
                label="Change profile photo"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{user?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                  {(user as any)?.isEmailVerified ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                      Unverified
                    </span>
                  )}
                </div>
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium capitalize">
                  {(user as any)?.role || 'user'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" placeholder="Your full name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={user?.email} className="input-field pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed" disabled />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-10" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl">
                  {saving ? <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                { label: 'New Password', value: newPassword, setter: setNewPassword },
                { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} className="rounded" />
                  Show passwords
                </label>
                <button type="submit" disabled={changingPassword} className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl">
                  {changingPassword ? <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Lock className="w-4 h-4" />}
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
