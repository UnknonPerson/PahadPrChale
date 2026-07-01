import api from './api';

export const notificationService = {
  async getAll(params) {
    return api.get('/notifications', { params });
  },

  async getUnreadCount() {
    return api.get('/notifications/unread-count');
  },

  async markAsRead(id) {
    return api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.put('/notifications/read-all');
  },

  async delete(id) {
    return api.delete(`/notifications/${id}`);
  },

  async deleteRead() {
    return api.delete('/notifications/read');
  },
};

export default notificationService;
