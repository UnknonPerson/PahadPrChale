import { useState, useEffect, useCallback } from 'react';
import hotelService from '../services/hotelService';
import { fallbackHotels } from '../data/hotels';

export function useHotels(filters = {}) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getAll(filters);
      const data = response.data || response;
      setHotels(data.length > 0 ? data : fallbackHotels);
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      setError(err.message || 'Failed to load hotels');
      setHotels(fallbackHotels);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return { hotels, loading, error, refetch: fetchHotels };
}

export function useHotel(id) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true);
        setError(null);
        const response = await hotelService.getById(id);
        setHotel(response.data || response);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
        setError(err.message || 'Failed to load hotel');
        const fallback = fallbackHotels.find(h => h.id === id);
        setHotel(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchHotel();
  }, [id]);

  return { hotel, loading, error };
}

export function useHotelActions() {
  const create = async (data) => {
    const response = await hotelService.create(data);
    return response.data || response;
  };

  const update = async (id, data) => {
    const response = await hotelService.update(id, data);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await hotelService.delete(id);
    return response.data || response;
  };

  return { create, update, remove };
}
