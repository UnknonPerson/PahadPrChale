import api from './api';

const tripService = {
  create: (data) => api.post('/trips', data),
  getMy: () => api.get('/trips/my'),
  getAll: (params = {}) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  getStats: () => api.get('/trips/stats'),
  update: (id, data) => api.put(`/trips/${id}`, data),
  cancel: (id) => api.put(`/trips/${id}/cancel`),
  delete: (id) => api.delete(`/trips/${id}`),
};

export default tripService;
