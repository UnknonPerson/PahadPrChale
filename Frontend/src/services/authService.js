import api from './api';

// All methods return the raw API payload: { success, message, data, ... }
// The axios interceptor already strips the axios wrapper.

const authService = {
  register: (name, email, phone, password) =>
    api.post('/auth/register', { name, email, phone, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  getCurrentUser: () =>
    api.get('/auth/me'),

  updateProfile: (data) => {
    const isFormData = data instanceof FormData;
    return api.put('/auth/update-profile', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },

  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  deleteAccount: (password) =>
    api.delete('/auth/delete-account', { data: { password } }),

  verifyEmail: (token) =>
    api.get(`/auth/verify-email/${token}`),

  resendVerification: (email) =>
    api.post('/auth/resend-verification', { email }),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.put(`/auth/reset-password/${token}`, { password }),
};

export default authService;
