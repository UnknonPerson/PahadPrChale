import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export function useNotifications(params = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const paramsKey = JSON.stringify(params);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationService.getAll(params);
      const items = res?.data?.notifications ?? res?.notifications ?? res?.data ?? [];
      const list  = Array.isArray(items) ? items : [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  // ── Optimistic updates ────────────────────────────────────────────────

  const markAsRead = useCallback(async (id) => {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationService.markAsRead(id);
    } catch {
      // Rollback on error
      fetch();
    }
  }, [fetch]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationService.markAllAsRead();
    } catch {
      fetch();
    }
  }, [fetch]);

  const remove = useCallback(async (id) => {
    const removed = notifications.find((n) => n._id === id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (removed && !removed.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationService.delete(id);
    } catch {
      fetch();
    }
  }, [notifications, fetch]);

  const refetch = fetch;

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, remove, refetch };
}

export function useUnreadNotificationCount() {
  const [count, setCount]   = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setCount(res?.data?.count ?? res?.count ?? 0);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const id = setInterval(refetch, 30_000);
    return () => clearInterval(id);
  }, [refetch]);

  return { count, loading, refetch };
}
