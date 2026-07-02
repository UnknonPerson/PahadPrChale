import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../services/vehicleService';

function normalizeImages(images = []) {
  return images.map((img) => (typeof img === 'string' ? img : img?.url || '')).filter(Boolean);
}

function normalizeVehicle(v) {
  if (!v) return v;
  const imgs = normalizeImages(v.images);
  return { ...v, image: imgs[0] || '', images: imgs };
}

export function useVehicles(initialFilters = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const filtersKey = JSON.stringify(initialFilters);

  const fetchVehicles = useCallback(async (filters = initialFilters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await vehicleService.getAll(filters);
      const raw = res?.data ?? (Array.isArray(res) ? res : []);
      setVehicles(raw.map(normalizeVehicle));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

export function useVehicle(id) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await vehicleService.getById(id);
        const raw = res?.data?.vehicle ?? res?.vehicle ?? res?.data ?? null;
        if (!cancelled) setVehicle(normalizeVehicle(raw));
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Vehicle not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { vehicle, loading, error };
}

export function useVehicleActions() {
  return {
    create: (data) => vehicleService.create(data),
    update: (id, data) => vehicleService.update(id, data),
    remove: (id) => vehicleService.delete(id),
  };
}
