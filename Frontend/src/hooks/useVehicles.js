import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../services/vehicleService';

// Normalize vehicle images: supports both old string-array and new {url,publicId}
function normalizeVehicle(vehicle) {
  if (!vehicle) return vehicle;
  const images = (vehicle.images || []).map((img) =>
    typeof img === 'string' ? img : img?.url || ''
  ).filter(Boolean);
  return {
    ...vehicle,
    image: images[0] || vehicle.image || '',
    images, // flat string array
  };
}

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
      const raw = Array.isArray(data) ? data : (data?.vehicles || []);
      setVehicles(raw.map(normalizeVehicle));
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
      if (!id) { setLoading(false); return; }
      try {
        setLoading(true);
        setError(null);
        const response = await vehicleService.getById(id);
        const raw = response.data?.vehicle || response.vehicle || response.data || response;
        setVehicle(normalizeVehicle(raw));
      } catch (err) {
        console.error('Failed to fetch vehicle:', err);
        setError(err.message || 'Failed to load vehicle');
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
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
