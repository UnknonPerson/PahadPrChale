import api from './api';

export const customTourService = {
  async create(data) {
    return api.post('/custom-tours', data);
  },

  async getMy(params) {
    return api.get('/custom-tours/my', { params });
  },

  async getById(id) {
    return api.get(`/custom-tours/${id}`);
  },

  async getAll(params) {
    return api.get('/custom-tours', { params });
  },

  async updateStatus(id, data) {
    return api.put(`/custom-tours/${id}/status`, data);
  },

  async cancel(id) {
    return api.put(`/custom-tours/${id}/cancel`);
  },

  async delete(id) {
    return api.delete(`/custom-tours/${id}`);
  },

  async getStats() {
    return api.get('/custom-tours/stats');
  },
};

export default customTourService;
