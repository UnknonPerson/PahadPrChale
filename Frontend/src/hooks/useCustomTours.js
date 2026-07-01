import { useState, useEffect, useCallback } from 'react';
import customTourService from '../services/customTourService';

export function useMyCustomTours(params = {}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customTourService.getMy(params);
      const data = response.data || response;
      setRequests(data.requests || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch custom tour requests:', err);
      setError(err.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, pagination, refetch: fetchRequests };
}

export function useAllCustomTours(params = {}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customTourService.getAll(params);
      const data = response.data || response;
      setRequests(data.requests || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch custom tour requests:', err);
      setError(err.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, pagination, refetch: fetchRequests };
}

export function useCustomTourStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customTourService.getStats();
      const data = response.data || response;
      setStats(data.stats || data);
    } catch (err) {
      console.error('Failed to fetch custom tour stats:', err);
      setError(err.message || 'Failed to load stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useCustomTourActions() {
  const create = async (data) => {
    const response = await customTourService.create(data);
    return response.data || response;
  };

  const updateStatus = async (id, data) => {
    const response = await customTourService.updateStatus(id, data);
    return response.data || response;
  };

  const cancel = async (id) => {
    const response = await customTourService.cancel(id);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await customTourService.delete(id);
    return response.data || response;
  };

  return { create, updateStatus, cancel, remove };
}
