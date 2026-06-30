import api from './api';

export const testimonialService = {
  async getAll() {
    return api.get('/testimonials');
  },

  async getFeatured() {
    return api.get('/testimonials/featured');
  },

  async create(data) {
    return api.post('/testimonials', data);
  },

  async update(id, data) {
    return api.put(`/testimonials/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/testimonials/${id}`);
  },
};

export default testimonialService;
