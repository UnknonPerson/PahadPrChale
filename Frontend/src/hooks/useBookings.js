import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';

// Alias used by admin pages
export function useAllBookings(filters = {}) {
  return useBookings(filters);
}

export function useBookings(filters = {}) {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [pagination, setPagination] = useState(null);

  const filtersKey = JSON.stringify(filters);

  const fetchBookings = useCallback(async (params = filters) => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingService.getAll(params);
      setBookings(res?.data ?? (Array.isArray(res) ? res : []));
      if (res?.pagination) setPagination(res.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return { bookings, loading, error, pagination, refetch: fetchBookings };
}

export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingService.getMy();
      setBookings(res?.data?.bookings ?? res?.bookings ?? res?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMyBookings(); }, [fetchMyBookings]);

  return { bookings, loading, error, refetch: fetchMyBookings };
}

export function useBookingActions() {
  return {
    create: (data) => bookingService.create(data),
    cancel: (id) => bookingService.cancel(id),
    updateStatus: (id, status, reason) => bookingService.updateStatus(id, status, reason),
    remove: (id) => bookingService.delete(id),
    getStats: () => bookingService.getStats(),
  };
}
