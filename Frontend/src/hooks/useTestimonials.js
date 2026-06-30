import { useState, useEffect, useCallback } from 'react';
import testimonialService from '../services/testimonialService';
import { fallbackTestimonials } from '../data/testimonials';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialService.getAll();
      const data = response.data || response;
      setTestimonials(data.length > 0 ? data : fallbackTestimonials);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError(err.message || 'Failed to load testimonials');
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return { testimonials, loading, error, refetch: fetchTestimonials };
}

export function useTestimonialActions() {
  const create = async (data) => {
    const response = await testimonialService.create(data);
    return response.data || response;
  };

  const update = async (id, data) => {
    const response = await testimonialService.update(id, data);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await testimonialService.delete(id);
    return response.data || response;
  };

  return { create, update, remove };
}
