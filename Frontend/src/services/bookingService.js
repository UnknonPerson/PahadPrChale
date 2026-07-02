import api from './api';

export const bookingService = {
  async getAll() {
    return api.get('/bookings');
  },

  async getMy() {
    return api.get('/bookings/my');
  },

  async getById(id) {
    return api.get(`/bookings/${id}`);
  },

  async create(data) {
    return api.post('/bookings', data);
  },

  async update(id, data) {
    return api.put(`/bookings/${id}`, data);
  },

  async updateStatus(id, status) {
    return api.put(`/bookings/${id}/status`, { status });
  },

  async cancel(id) {
    return api.put(`/bookings/${id}/cancel`);
  },

  async delete(id) {
    return api.delete(`/bookings/${id}`);
  },

  async getStats() {
    return api.get('/bookings/stats');
  },
};

export default bookingService;
