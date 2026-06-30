import { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  Check,
  Reply,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { fallbackMessages, type Message } from '../../data/adminData';

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messagesList, setMessagesList] = useState<Message[]>(fallbackMessages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // Try to fetch from API endpoint
        const response = await fetch('/api/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Ensure data is an array, handle both direct array and data wrapper
          const messagesData = Array.isArray(data) ? data : data.messages || data.data || [];
          if (messagesData.length > 0) {
            setMessagesList(messagesData);
          } else {
            setMessagesList(fallbackMessages);
          }
        } else {
          // API endpoint doesn't exist or failed, use fallback
          setMessagesList(fallbackMessages);
        }
      } catch (error) {
        // Network error or API unavailable, use fallback
        console.error('Failed to fetch messages:', error);
        setMessagesList(fallbackMessages);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messagesList.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'read':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'replied':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (msgId: string, newStatus: Message['status']) => {
    setMessagesList((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: newStatus } : m))
    );
    if (selectedMessage?.id === msgId) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  };

  const handleDelete = (msgId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessagesList((prev) => prev.filter((m) => m.id !== msgId));
      setSelectedMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Contact form submissions and inquiries
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-xl font-bold text-blue-500">
                {messagesList.filter(m => m.status === 'unread').length}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Read</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {messagesList.filter(m => m.status === 'read').length}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Replied</p>
              <p className="text-xl font-bold text-green-500">
                {messagesList.filter(m => m.status === 'replied').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
            {loading && (
              <div className="py-8 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-2">Loading messages...</p>
              </div>
            )}
            {!loading && filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {message.name}
                      </p>
                      {message.status === 'unread' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {message.createdAt}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            ))}

            {!loading && filteredMessages.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No messages found
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 glass-card p-6">
          {selectedMessage ? (
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span>From: {selectedMessage.name}</span>
                    <span>|</span>
                    <Mail className="w-4 h-4" />
                    <span>{selectedMessage.email}</span>
                    {selectedMessage.phone && (
                      <>
                        <span>|</span>
                        <Phone className="w-4 h-4" />
                        <span>{selectedMessage.phone}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedMessage.createdAt}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Check className="w-4 h-4" /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
                >
                  <Reply className="w-4 h-4" /> Reply
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Mail className="w-16 h-16 mb-4 opacity-30" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
