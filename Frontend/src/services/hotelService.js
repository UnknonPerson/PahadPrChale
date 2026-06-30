import api from './api';

export const hotelService = {
  async getAll(params) {
    return api.get('/hotels', { params });
  },

  async getById(id) {
    return api.get(`/hotels/${id}`);
  },

  async create(data) {
    return api.post('/hotels', data);
  },

  async update(id, data) {
    return api.put(`/hotels/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/hotels/${id}`);
  },
};

export default hotelService;
