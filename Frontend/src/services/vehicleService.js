import api from './api';

export const vehicleService = {
  async getAll(params) {
    return api.get('/vehicles', { params });
  },

  async getById(id) {
    return api.get(`/vehicles/${id}`);
  },

  async create(data) {
    return api.post('/vehicles', data);
  },

  async update(id, data) {
    return api.put(`/vehicles/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/vehicles/${id}`);
  },
};

export default vehicleService;
