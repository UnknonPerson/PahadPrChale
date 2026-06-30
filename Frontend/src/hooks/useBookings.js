import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';
import { fallbackBookings } from '../data/adminData';

export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getMy();
      const data = response.data || response;
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useAllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getAll();
      const data = response.data || response;
      setBookings(data.length > 0 ? data : fallbackBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.message || 'Failed to load bookings');
      setBookings(fallbackBookings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useBookingActions() {
  const create = async (data) => {
    const response = await bookingService.create(data);
    return response.data || response;
  };

  const cancel = async (id) => {
    const response = await bookingService.cancel(id);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await bookingService.delete(id);
    return response.data || response;
  };

  return { create, cancel, remove };
}
