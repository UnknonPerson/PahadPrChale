import { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';

export function usePackageReviews(packageId, params = {}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!packageId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getByPackage(packageId, params);
      const data = response.data || response;
      setReviews(data.reviews || data.data || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError(err.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [packageId, params?.page, params?.limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, pagination, refetch: fetchReviews };
}

export function useMyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewService.getMy();
        const data = response.data || response;
        setReviews(data.reviews || data || []);
      } catch (err) {
        console.error('Failed to fetch my reviews:', err);
        setError(err.message || 'Failed to load reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return { reviews, loading, error };
}

export function useAllReviews(params = {}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getAll(params);
      const data = response.data || response;
      setReviews(data.reviews || data.data || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError(err.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.status, params?.package]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, pagination, refetch: fetchReviews };
}

export function useReviewStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await reviewService.getStats();
        const data = response.data || response;
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch review stats:', err);
        setError(err.message || 'Failed to load stats');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useReviewActions() {
  const create = async (data) => {
    const response = await reviewService.create(data);
    return response.data || response;
  };

  const updateStatus = async (id, status) => {
    const response = await reviewService.updateStatus(id, status);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await reviewService.delete(id);
    return response.data || response;
  };

  const canReview = async (bookingId) => {
    const response = await reviewService.canReview(bookingId);
    return response.data || response;
  };

  return { create, updateStatus, remove, canReview };
}
