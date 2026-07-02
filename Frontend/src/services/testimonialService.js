import api from './api';

const testimonialService = {
  getAll: (params = {}) => api.get('/testimonials', { params }),
  getFeatured: () => api.get('/testimonials/featured'),
  create: (data) => api.post('/testimonials', data),
  approve: (id) => api.put(`/testimonials/${id}/approve`),
  reject: (id) => api.put(`/testimonials/${id}/reject`),
  feature: (id) => api.put(`/testimonials/${id}/feature`),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export default testimonialService;
