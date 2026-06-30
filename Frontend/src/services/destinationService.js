import api from './api';

export const destinationService = {
  async getAll() {
    return api.get('/destinations');
  },

  async getById(id) {
    return api.get(`/destinations/${id}`);
  },

  async create(data) {
    return api.post('/destinations', data);
  },

  async update(id, data) {
    return api.put(`/destinations/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/destinations/${id}`);
  },
};

export default destinationService;
