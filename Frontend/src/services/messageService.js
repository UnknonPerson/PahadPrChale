import api from './api';

const messageService = {
  create: (data) => api.post('/messages', data),
  getMy: (params = {}) => api.get('/messages/my', { params }),
  getAll: (params = {}) => api.get('/messages', { params }),
  getById: (id) => api.get(`/messages/${id}`),
  getUnreadCount: () => api.get('/messages/unread-count'),
  markRead: (id) => api.put(`/messages/${id}/read`),
  reply: (id, reply) => api.post(`/messages/${id}/reply`, { reply }),
  delete: (id) => api.delete(`/messages/${id}`),
};

export default messageService;
