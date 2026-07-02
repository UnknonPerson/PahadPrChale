import api from './api';

const reviewService = {
  getAll: (params = {}) => api.get('/reviews', { params }),
  getByPackage: (packageId) => api.get(`/reviews/package/${packageId}`),
  getMy: () => api.get('/reviews/my'),
  getStats: () => api.get('/reviews/stats'),
  canReview: (bookingId) => api.get(`/reviews/can-review/${bookingId}`),
  create: (data) => api.post('/reviews', data),
  updateStatus: (id, status) => api.put(`/reviews/${id}/status`, { status }),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
