import { useState, useEffect, useCallback } from 'react';
import tripService from '../services/tripService';

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tripService.getMy();
      setTrips(res?.data ?? (Array.isArray(res) ? res : []));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { trips, loading, error, refetch: fetch };
}

export function useAllTrips(filters = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tripService.getAll(filters);
      setTrips(res?.data ?? (Array.isArray(res) ? res : []));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { trips, loading, error, refetch: fetch };
}

export function useTripActions() {
  return {
    create: (data) => tripService.create(data),
    update: (id, data) => tripService.update(id, data),
    cancel: (id) => tripService.cancel(id),
    remove: (id) => tripService.delete(id),
  };
}
