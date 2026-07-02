import api from './api';

const activityService = {
  getAll: (params = {}) => api.get('/activities', { params }),
  getRecent: (limit = 10) => api.get('/activities/recent', { params: { limit } }),
  getStats: () => api.get('/activities/stats'),
  deleteOld: () => api.delete('/activities/old'),
};

export default activityService;
