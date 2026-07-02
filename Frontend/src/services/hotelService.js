import api from './api';

const hotelService = {
  getAll: (params = {}) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  getByDestination: (destination) => api.get(`/hotels/destination/${destination}`),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
};

export default hotelService;
