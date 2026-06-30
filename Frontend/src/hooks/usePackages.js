import { useState, useEffect, useCallback } from 'react';
import packageService from '../services/packageService';
import { fallbackPackages } from '../data/packages';

export function usePackages(filters = {}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await packageService.getAll(filters);
      const data = response.data || response;
      setPackages(data.length > 0 ? data : fallbackPackages);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setError(err.message || 'Failed to load packages');
      setPackages(fallbackPackages);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return { packages, loading, error, refetch: fetchPackages };
}

export function usePackage(id) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPackage() {
      try {
        setLoading(true);
        setError(null);
        const response = await packageService.getById(id);
        setPkg(response.data || response);
      } catch (err) {
        console.error('Failed to fetch package:', err);
        setError(err.message || 'Failed to load package');
        const fallback = fallbackPackages.find(p => p.id === id);
        setPkg(fallback || null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPackage();
  }, [id]);

  return { pkg, loading, error };
}

export function usePackageActions() {
  const create = async (data) => {
    const response = await packageService.create(data);
    return response.data || response;
  };

  const update = async (id, data) => {
    const response = await packageService.update(id, data);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await packageService.delete(id);
    return response.data || response;
  };

  return { create, update, remove };
}
