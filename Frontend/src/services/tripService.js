import api from './api';

export const tripService = {
  async getAll() {
    return api.get('/trips');
  },

  async getMy() {
    return api.get('/trips/my');
  },

  async getById(id) {
    return api.get(`/trips/${id}`);
  },

  async create(data) {
    return api.post('/trips', data);
  },

  async update(id, data) {
    return api.put(`/trips/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/trips/${id}`);
  },

  async submitTripPlanner(data) {
    return api.post('/trips/planner', data);
  },
};

export default tripService;
