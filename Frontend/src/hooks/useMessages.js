import { useState, useEffect, useCallback } from 'react';
import messageService from '../services/messageService';

export function useMyMessages(params = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageService.getMy(params);
      const data = response.data || response;
      setMessages(data.messages || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.status]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, pagination, refetch: fetchMessages };
}

export function useAllMessages(params = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageService.getAll(params);
      const data = response.data || response;
      setMessages(data.messages || data || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.status]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, pagination, refetch: fetchMessages };
}

export function useUnreadMessageCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    try {
      const response = await messageService.getUnreadCount();
      const data = response.data || response;
      setCount(data.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, refetch: fetchCount };
}

export function useMessageActions() {
  const create = async (data) => {
    const response = await messageService.create(data);
    return response.data || response;
  };

  const markAsRead = async (id) => {
    const response = await messageService.markAsRead(id);
    return response.data || response;
  };

  const reply = async (id, replyText) => {
    const response = await messageService.reply(id, replyText);
    return response.data || response;
  };

  const remove = async (id) => {
    const response = await messageService.delete(id);
    return response.data || response;
  };

  return { create, markAsRead, reply, remove };
}
