import { useState, useEffect, useCallback } from 'react';
import hotelService from '../services/hotelService';

// Normalize hotel data: supports both old string-array and new {url,publicId} images
function normalizeHotel(hotel) {
  if (!hotel) return hotel;
  const images = (hotel.images || []).map((img) =>
    typeof img === 'string' ? img : img?.url || ''
  ).filter(Boolean);
  return {
    ...hotel,
    image: images[0] || hotel.image || '',
    gallery: images.slice(1),
    images, // raw normalized string array for convenience
  };
}

export function useHotels(filters = {}) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.getAll(filters);
      const data = response.data || response;
      const raw = Array.isArray(data) ? data : (data?.hotels || []);
      setHotels(raw.map(normalizeHotel));
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      setError(err.message || 'Failed to load hotels');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

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
      if (!id) { setLoading(false); return; }
      try {
        setLoading(true);
        setError(null);
        const response = await hotelService.getById(id);
        const raw = response.data?.hotel || response.hotel || response.data || response;
        setHotel(normalizeHotel(raw));
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
        setError(err.message || 'Failed to load hotel');
        setHotel(null);
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
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
