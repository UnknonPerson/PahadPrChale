import api from './api';

const bookingService = {
  create: (data) => api.post('/bookings', data),
  getAll: (params = {}) => api.get('/bookings', { params }),
  getMy: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
  updateStatus: (id, status, reason) => api.put(`/bookings/${id}/status`, { status, reason }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default bookingService;
