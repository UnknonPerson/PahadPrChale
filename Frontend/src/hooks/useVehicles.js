import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../services/vehicleService';
import { fallbackVehicles } from '../data/vehicles';

export function useVehicles(filters = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vehicleService.getAll(filters);
      const data = response.data || response;
      setVehicles(Array.isArray(data) && data.length > 0 ? data : []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError(err.message || 'Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}

export function useVehicle(id) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        setLoading(true);
        setError(null);
        const response = await vehicleService.getById(id);
        setVehicle(response.data || response);
      } catch (err) {
        console.error('Failed to fetch vehicle:', err);
        setError(err.message || 'Failed to load vehicle');
        const fallback = fallbackVehicles.find(v => v.id === id);
        setVehicle(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchVehicle();
  }, [id]);

  return { vehicle, loading, error };
}

export function useVehicleActions() {
  const create = async (data) => {
    const response = await vehicleService.create(data);
    return response.data || response;
  };

  const update = async (id, data) => {
    const response = await vehicleService.update(id, data);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await vehicleService.delete(id);
    return response.data || response;
  };

  return { create, update, remove };
}
