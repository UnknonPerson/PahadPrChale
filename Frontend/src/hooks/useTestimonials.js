import { useState, useEffect, useCallback } from 'react';
import testimonialService from '../services/testimonialService';

export function useTestimonials(onlyFeatured = false) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = onlyFeatured
        ? await testimonialService.getFeatured()
        : await testimonialService.getAll({ status: 'approved', limit: 20 });
      const items = res?.data?.testimonials ?? res?.testimonials ?? res?.data ?? [];
      setTestimonials(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, [onlyFeatured]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  return { testimonials, loading, error, refetch: fetchTestimonials };
}
