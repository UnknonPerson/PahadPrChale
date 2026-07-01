import api from './api';

export const reviewService = {
  async create(data) {
    return api.post('/reviews', data);
  },

  async getByPackage(packageId, params) {
    return api.get(`/reviews/package/${packageId}`, { params });
  },

  async getMy() {
    return api.get('/reviews/my');
  },

  async getAll(params) {
    return api.get('/reviews', { params });
  },

  async getStats() {
    return api.get('/reviews/stats');
  },

  async updateStatus(id, status) {
    return api.put(`/reviews/${id}/status`, { status });
  },

  async delete(id) {
    return api.delete(`/reviews/${id}`);
  },

  async canReview(bookingId) {
    return api.get(`/reviews/can-review/${bookingId}`);
  },
};

export default reviewService;
