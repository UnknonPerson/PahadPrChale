import api from './api';

const vehicleService = {
  getAll: (params = {}) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  getByDestination: (destination, seats) =>
    api.get(`/vehicles/destination/${destination}`, { params: seats ? { seats } : {} }),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

export default vehicleService;
