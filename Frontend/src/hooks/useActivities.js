import { useState, useEffect, useCallback } from 'react';
import activityService from '../services/activityService';

export function useActivities(params = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityService.getAll(params);
      const data = response.data || response;
      setActivities(data.activities || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError(err.message || 'Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.type, params?.user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, pagination, refetch: fetchActivities };
}

export function useRecentActivities(limit = 10) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityService.getRecent(limit);
      const data = response.data || response;
      setActivities(data.activities || data || []);
    } catch (err) {
      console.error('Failed to fetch recent activities:', err);
      setError(err.message || 'Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}

export function useActivityStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityService.getStats();
      const data = response.data || response;
      setStats(data.stats || data);
    } catch (err) {
      console.error('Failed to fetch activity stats:', err);
      setError(err.message || 'Failed to load activity stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
