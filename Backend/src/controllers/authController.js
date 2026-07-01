import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { generateToken, getTokenExpiration } from '../utils/jwt.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 'Email already registered', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  // Create activity
  await Activity.create({
    user: user._id,
    type: 'user_registered',
    description: `New user registered: ${name} (${email})`,
    relatedId: user._id,
    relatedModel: 'User',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Generate token
  const token = generateToken(user._id);

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    expires: getTokenExpiration(),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  sendSuccess(
    res,
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    },
    'User registered successfully',
    201
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return sendError(res, 'Please provide email and password', 400);
  }

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendError(res, 'Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 401);
  }

  // Create activity
  await Activity.create({
    user: user._id,
    type: 'user_login',
    description: `User logged in: ${user.name} (${user.email})`,
    relatedId: user._id,
    relatedModel: 'User',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Generate token
  const token = generateToken(user._id);

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    expires: getTokenExpiration(),
    secure: true,
    sameSite: 'none',
  });

  sendSuccess(
    res,
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    },
    'Login successful'
  );
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  sendSuccess(res, null, 'Logged out successfully');
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  sendSuccess(res, { user }, 'User fetched successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, profileImage } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, profileImage },
    { new: true, runValidators: true }
  );

  sendSuccess(res, { user }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, 'Please provide current and new password', 400);
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return sendError(res, 'Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendSuccess(res, null, 'Password changed successfully');
});
