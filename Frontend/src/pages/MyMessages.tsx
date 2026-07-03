import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Clock, CircleCheck as CheckCircle, Send, MessageSquare, RefreshCw } from 'lucide-react';
import { useMyMessages, useMessageActions } from '../hooks/useMessages';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function MyMessages() {
  const { messages, loading, error, refetch } = useMyMessages();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useMessageActions();
  const { isAuthenticated } = useAuth();

  // Auto-select first unread when messages load
  useEffect(() => {
    if (!selectedMessage && messages.length > 0) {
      setSelectedMessage(messages[0]);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newSubject.trim() || !newMessage.trim()) return;
    try {
      setIsSubmitting(true);
      await create({ subject: newSubject, message: newMessage });
      await refetch();
      setShowNewMessage(false);
      setNewSubject('');
      setNewMessage('');
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'read': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'replied': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <PageLoader />;

  const unreadCount = messages.filter((m: any) => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Messages</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mr-2">
                  {unreadCount} unread
                </span>
              )}
              Conversations with support
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNewMessage(!showNewMessage)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              <Send className="w-4 h-4" />
              New Message
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* New Message Form */}
        {showNewMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Send a Message to Support</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="input-field"
                  placeholder="What is your message about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input-field h-32 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowNewMessage(false); setNewSubject(''); setNewMessage(''); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isSubmitting || !newSubject.trim() || !newMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    <><Send className="w-4 h-4" />Send</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Conversations ({messages.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Send a message to get help</p>
                </div>
              ) : (
                messages.map((message: any) => (
                  <button
                    key={message._id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      selectedMessage?._id === message._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate flex-1">{message.subject}</p>
                      {message.status === 'unread' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      {message.status === 'replied' && (
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{message.message?.substring(0, 50)}...</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(message.createdAt)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {selectedMessage ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{selectedMessage.subject}</h2>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {selectedMessage.reply ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Reply from Support Team
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.reply}</p>
                    {selectedMessage.repliedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Replied on {formatDate(selectedMessage.repliedAt)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                      Our support team will reply to this message within 24 hours.
                    </p>
                  </div>
                )}
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
    </div>
  );
}
