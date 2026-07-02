import { useState, useEffect, useCallback } from 'react';
import activityService from '../services/activityService';

export function useActivityStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    activityService.getStats()
      .then((res) => setStats(res?.data?.stats ?? res?.stats ?? null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);
  return { stats, loading };
}

export function useActivities(filters = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const filtersKey = JSON.stringify(filters);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await activityService.getAll(filters);
      setActivities(res?.data ?? (Array.isArray(res) ? res : []));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { activities, loading, error, refetch: fetch };
}

export function useRecentActivities(limit = 10) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await activityService.getRecent(limit);
      setActivities(res?.data?.activities ?? res?.activities ?? res?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { activities, loading, error, refetch: fetch };
}
