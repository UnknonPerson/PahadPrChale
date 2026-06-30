import { useState, useEffect, useCallback } from 'react';
import destinationService from '../services/destinationService';
import { fallbackDestinations } from '../data/destinations';

export function useDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await destinationService.getAll();
      const data = response.data || response;
      setDestinations(data.length > 0 ? data : fallbackDestinations);
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
      setError(err.message || 'Failed to load destinations');
      setDestinations(fallbackDestinations);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  return { destinations, loading, error, refetch: fetchDestinations };
}

export function useDestination(id) {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDestination() {
      try {
        setLoading(true);
        setError(null);
        const response = await destinationService.getById(id);
        setDestination(response.data || response);
      } catch (err) {
        console.error('Failed to fetch destination:', err);
        setError(err.message || 'Failed to load destination');
        const fallback = fallbackDestinations.find(d => d.id === id);
        setDestination(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDestination();
  }, [id]);

  return { destination, loading, error };
}

export function useDestinationActions() {
  const create = async (data) => {
    const response = await destinationService.create(data);
    return response.data || response;
  };

  const update = async (id, data) => {
    const response = await destinationService.update(id, data);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await destinationService.delete(id);
    return response.data || response;
  };

  return { create, update, remove };
}
