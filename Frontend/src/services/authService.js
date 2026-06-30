import api from './api';

export const authService = {
  async login(email, password) {
    return api.post('/auth/login', { email, password });
  },

  async register(name, email, password, phone) {
    return api.post('/auth/register', { name, email, password, phone });
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  async updateProfile(data) {
    return api.put('/users/profile', data);
  },

  async changePassword(currentPassword, newPassword) {
    return api.put('/users/password', { currentPassword, newPassword });
  },

  async deleteAccount() {
    return api.delete('/users/account');
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, password) {
    return api.post(`/auth/reset-password/${token}`, { password });
  },
};

export default authService;
