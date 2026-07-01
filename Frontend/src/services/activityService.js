import api from './api';

export const activityService = {
  async getAll(params) {
    return api.get('/activities', { params });
  },

  async getRecent(limit = 10) {
    return api.get('/activities/recent', { params: { limit } });
  },

  async getStats() {
    return api.get('/activities/stats');
  },

  async getById(id) {
    return api.get(`/activities/${id}`);
  },

  async deleteOld(days = 90) {
    return api.delete('/activities/old', { params: { days } });
  },
};

export default activityService;
