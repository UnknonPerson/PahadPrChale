import { useState, useEffect, useCallback } from 'react';
import tripService from '../services/tripService';

export function useMyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.getMy();
      const data = response.data || response;
      setTrips(data || []);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setError(err.message || 'Failed to load trips');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
}

export function useTripActions() {
  const submitTripPlanner = async (data) => {
    const response = await tripService.submitTripPlanner(data);
    return response.data || response;
  };

  const create = async (data) => {
    const response = await tripService.create(data);
    return response.data || response;
  };

  const update = async (id, data) => {
    const response = await tripService.update(id, data);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await tripService.delete(id);
    return response.data || response;
  };

  return { submitTripPlanner, create, update, remove };
}
