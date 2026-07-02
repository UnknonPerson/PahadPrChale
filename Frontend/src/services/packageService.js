import api from './api';

const packageService = {
  getAll: (params = {}) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  getFeatured: (limit = 6) => api.get('/packages/featured', { params: { limit } }),
  search: (q, limit = 10) => api.get('/packages/search', { params: { q, limit } }),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

export default packageService;
