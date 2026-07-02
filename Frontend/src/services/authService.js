import api from './api';

const authService = {
  async register(name, email, password, phone) {
    const res = await api.post('/auth/register', { name, email, password, phone });
    return res.data || res;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data || res;
  },

  async logout() {
    const res = await api.post('/auth/logout');
    return res.data || res;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data || res;
  },

  // Accepts FormData for image upload or plain object
  async updateProfile(data) {
    const isFormData = data instanceof FormData;
    const res = await api.put('/auth/update-profile', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data || res;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res.data || res;
  },

  async deleteAccount(password) {
    const res = await api.delete('/auth/delete-account', { data: { password } });
    return res.data || res;
  },

  async verifyEmail(token) {
    const res = await api.get(`/auth/verify-email/${token}`);
    return res.data || res;
  },

  async resendVerification(email) {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data || res;
  },

  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data || res;
  },

  async resetPassword(token, password) {
    const res = await api.put(`/auth/reset-password/${token}`, { password });
    return res.data || res;
  },
};

export default authService;
