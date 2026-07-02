import api from './api';

const destinationService = {
  getAll: (params = {}) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getFeatured: (limit = 6) => api.get('/destinations/featured', { params: { limit } }),
  getStates: () => api.get('/destinations/states'),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
  permanentDelete: (id) => api.delete(`/destinations/${id}/permanent`),
};

export default destinationService;
