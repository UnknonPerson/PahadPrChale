import api from './api';

export const messageService = {
  async create(data) {
    return api.post('/messages', data);
  },

  async getMy(params) {
    return api.get('/messages/my', { params });
  },

  async getById(id) {
    return api.get(`/messages/${id}`);
  },

  async getAll(params) {
    return api.get('/messages', { params });
  },

  async markAsRead(id) {
    return api.put(`/messages/${id}/read`);
  },

  async reply(id, reply) {
    return api.post(`/messages/${id}/reply`, { reply });
  },

  async delete(id) {
    return api.delete(`/messages/${id}`);
  },

  async getUnreadCount() {
    return api.get('/messages/unread-count');
  },
};

export default messageService;
