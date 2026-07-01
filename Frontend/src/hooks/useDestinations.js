import { useState, useEffect, useCallback } from 'react';
import destinationService from '../services/destinationService';

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
      setDestinations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
      setError(err.message || 'Failed to load destinations');
      setDestinations([]);
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
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await destinationService.getById(id);
        setDestination(response.data?.destination || response.destination || response.data || response);
      } catch (err) {
        console.error('Failed to fetch destination:', err);
        setError(err.message || 'Failed to load destination');
        setDestination(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDestination();
  }, [id]);

  return { destination, loading, error };
}

export function useFeaturedDestinations(limit = 4) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        setError(null);
        const response = await destinationService.getAll();
        const data = response.data || response;
        // Sort by rating and get top destinations
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit)
          : [];
        setDestinations(sorted);
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
        setError(err.message || 'Failed to load destinations');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, [limit]);

  return { destinations, loading, error };
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
