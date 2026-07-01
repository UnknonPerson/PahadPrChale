import { useState } from 'react';
import { motion } from 'framer-motion';
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
  X,
  Send,
} from 'lucide-react';
import { useAllMessages, useMessageActions, useUnreadMessageCount } from '../../hooks/useMessages';

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const { messages, loading, error, refetch } = useAllMessages({ status: statusFilter !== 'All' ? statusFilter : undefined });
  const unreadData = useUnreadMessageCount();
  const { markAsRead, reply, remove } = useMessageActions();

  const filteredMessages = messages.filter(
    (msg: any) =>
      (msg.user?.name || msg.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleMarkAsRead = async (msgId: string) => {
    try {
      await markAsRead(msgId);
      await refetch();
      if (selectedMessage?._id === msgId) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setIsReplying(true);
      await reply(selectedMessage._id, replyText);
      await refetch();
      setSelectedMessage({ ...selectedMessage, status: 'replied', reply: replyText });
      setReplyText('');
      setShowReplyModal(false);
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleDelete = async (msgId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await remove(msgId);
        await refetch();
        setSelectedMessage(null);
      } catch (err) {
        console.error('Failed to delete message:', err);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                {unreadData.count || messages.filter((m: any) => m.status === 'unread').length}
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
                {messages.filter((m: any) => m.status === 'read').length}
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
                {messages.filter((m: any) => m.status === 'replied').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Messages ({filteredMessages.length})</h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
            {loading && (
              <div className="py-8 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-2">Loading messages...</p>
              </div>
            )}

            {!loading && filteredMessages.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No messages found</p>
              </div>
            )}

            {!loading && filteredMessages.map((message: any) => (
              <motion.button
                key={message._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedMessage(message)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedMessage?._id === message._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {message.user?.name || 'Unknown User'}
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
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </motion.button>
            ))}
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
                    <span>From: {selectedMessage.user?.name || 'Unknown'}</span>
                    {selectedMessage.user?.email && (
                      <>
                        <span>|</span>
                        <Mail className="w-4 h-4" />
                        <span>{selectedMessage.user.email}</span>
                      </>
                    )}
                    {selectedMessage.user?.phone && (
                      <>
                        <span>|</span>
                        <Phone className="w-4 h-4" />
                        <span>{selectedMessage.user.phone}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedMessage.createdAt)}</span>
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

              {selectedMessage.reply && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-medium">
                    <Reply className="w-4 h-4" />
                    Reply Sent
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.reply}
                  </p>
                  {selectedMessage.repliedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Replied on {formatDate(selectedMessage.repliedAt)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Check className="w-4 h-4" /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
                >
                  <Reply className="w-4 h-4" /> Reply
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
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

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Reply to Message</h3>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Original message:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{selectedMessage.message}</p>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="input-field h-32 resize-none"
                autoFocus
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={isReplying || !replyText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
              >
                {isReplying ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
