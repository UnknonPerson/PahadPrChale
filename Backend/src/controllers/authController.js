import crypto from 'crypto';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateToken, getTokenExpiration } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import emailService from '../utils/emailService.js';
import { deleteFromCloudinary } from '../middleware/cloudinaryUpload.js';

// ─── Cookie helper ────────────────────────────────────────────────────────────

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: getTokenExpiration(),
  });
};

const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return sendError(res, 'Name, email and password are required', 400);
  }
  if (password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters', 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return sendError(res, 'An account with this email already exists', 409);

  const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password, phone });

  // Generate email verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save();

  // Send verification email (non-blocking)
  emailService.sendVerificationEmail(user.email, user.name, verificationToken);

  await Activity.create({
    user: user._id,
    type: 'user_registered',
    description: `New user registered: ${user.name} (${user.email})`,
  }).catch(() => {});

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  return sendSuccess(
    res,
    { user, token },
    'Registration successful. Please check your email to verify your account.',
    201
  );
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) return sendError(res, 'Invalid email or password', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return sendError(res, 'Invalid email or password', 401);

  if (!user.isActive) return sendError(res, 'Your account has been deactivated. Contact support.', 403);

  // Email verification check
  if (!user.isEmailVerified) {
    return sendError(
      res,
      'Please verify your email address before logging in. Check your inbox or request a new verification email.',
      403
    );
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  return sendSuccess(res, { user, token }, 'Login successful');
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  return sendSuccess(res, null, 'Logged out successfully');
});

// ─── Get current user ─────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return sendError(res, 'User not found', 404);
  return sendSuccess(res, { user }, 'User fetched successfully');
});

// ─── Update profile ───────────────────────────────────────────────────────────

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return sendError(res, 'User not found', 404);

  const { name, phone } = req.body;

  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone;

  // Handle Cloudinary image upload
  if (req.uploadedImage) {
    // Delete old image
    if (user.profileImagePublicId) {
      await deleteFromCloudinary(user.profileImagePublicId);
    }
    user.profileImage = req.uploadedImage.url;
    user.profileImagePublicId = req.uploadedImage.public_id;
  }

  await user.save({ validateBeforeSave: false });
  return sendSuccess(res, { user }, 'Profile updated successfully');
});

// ─── Change password ──────────────────────────────────────────────────────────

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, 'Current and new passwords are required', 400);
  }
  if (newPassword.length < 6) {
    return sendError(res, 'New password must be at least 6 characters', 400);
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) return sendError(res, 'User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return sendError(res, 'Current password is incorrect', 400);

  user.password = newPassword;
  await user.save();

  return sendSuccess(res, null, 'Password changed successfully');
});

// ─── Verify Email ─────────────────────────────────────────────────────────────

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    return sendError(res, 'Invalid or expired verification link. Please request a new one.', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Send welcome email
  emailService.sendWelcome(user.email, user.name);

  return sendSuccess(res, { user }, 'Email verified successfully. You can now log in.');
});

// ─── Resend Verification Email ────────────────────────────────────────────────

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 'Email is required', 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+emailVerificationToken +emailVerificationExpires'
  );
  if (!user) return sendError(res, 'No account found with that email', 404);
  if (user.isEmailVerified) return sendError(res, 'This email is already verified', 400);

  const token = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  emailService.sendVerificationEmail(user.email, user.name, token);

  return sendSuccess(res, null, 'Verification email sent. Please check your inbox.');
});

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, 'Email is required', 400);

  const user = await User.findOne({ email: email.toLowerCase() });
  // Always return success to prevent email enumeration
  if (!user) {
    return sendSuccess(res, null, 'If that email exists, a reset link has been sent.');
  }

  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  emailService.sendPasswordReset(user.email, user.name, token);

  return sendSuccess(res, null, 'Password reset email sent. Please check your inbox.');
});

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters', 400);
  }

  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    return sendError(res, 'Invalid or expired reset link. Please request a new one.', 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return sendSuccess(res, null, 'Password reset successful. You can now log in.');
});

// ─── Delete account ───────────────────────────────────────────────────────────

export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return sendError(res, 'User not found', 404);

  const { password } = req.body;
  if (password) {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 'Incorrect password', 400);
  }

  if (user.profileImagePublicId) {
    await deleteFromCloudinary(user.profileImagePublicId);
  }

  await User.findByIdAndDelete(req.user.id);
  clearTokenCookie(res);

  return sendSuccess(res, null, 'Account deleted successfully');
});
