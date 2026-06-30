import api from './api';

export const packageService = {
  async getAll(params) {
    return api.get('/packages', { params });
  },

  async getById(id) {
    return api.get(`/packages/${id}`);
  },

  async getFeatured() {
    return api.get('/packages/featured');
  },

  async create(data) {
    return api.post('/packages', data);
  },

  async update(id, data) {
    return api.put(`/packages/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/packages/${id}`);
  },
};

export default packageService;
