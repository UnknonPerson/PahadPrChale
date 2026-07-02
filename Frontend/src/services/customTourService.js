import api from './api';

const customTourService = {
  create: (data) => api.post('/custom-tours', data),
  getMy: (params = {}) => api.get('/custom-tours/my', { params }),
  getAll: (params = {}) => api.get('/custom-tours', { params }),
  getById: (id) => api.get(`/custom-tours/${id}`),
  getStats: () => api.get('/custom-tours/stats'),
  updateStatus: (id, data) => api.put(`/custom-tours/${id}/status`, data),
  cancel: (id) => api.put(`/custom-tours/${id}/cancel`),
};

export default customTourService;
