import { useState, useEffect, useCallback } from 'react';
import hotelService from '../services/hotelService';

function normalizeImages(images = []) {
  return images.map((img) => (typeof img === 'string' ? img : img?.url || '')).filter(Boolean);
}

function normalizeHotel(h) {
  if (!h) return h;
  const imgs = normalizeImages(h.images);
  return { ...h, image: imgs[0] || '', gallery: imgs.slice(1), images: imgs };
}

export function useHotels(initialFilters = {}) {
  const [hotels, setHotels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const filtersKey = JSON.stringify(initialFilters);

  const fetchHotels = useCallback(async (filters = initialFilters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await hotelService.getAll(filters);
      const raw = res?.data ?? (Array.isArray(res) ? res : []);
      setHotels(raw.map(normalizeHotel));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load hotels');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  return { hotels, loading, error, refetch: fetchHotels };
}

export function useHotel(id) {
  const [hotel, setHotel]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await hotelService.getById(id);
        const raw = res?.data?.hotel ?? res?.hotel ?? res?.data ?? null;
        if (!cancelled) setHotel(normalizeHotel(raw));
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Hotel not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { hotel, loading, error };
}

export function useHotelActions() {
  return {
    create: (data) => hotelService.create(data),
    update: (id, data) => hotelService.update(id, data),
    remove: (id) => hotelService.delete(id),
  };
}
