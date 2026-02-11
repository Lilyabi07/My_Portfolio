import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import './ContactMessagesManager.css';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  submittedAt: string;
  readAt?: string;
}

function ContactMessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { t } = useLanguage();

  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact/messages', authConfig);
      setMessages(response.data);
    } catch (err: any) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/contact/messages/${id}/mark-read`, {}, authConfig);
      setSuccess('Message marked as read');
      fetchMessages();
      setSelectedMessage(null);
    } catch (err: any) {
      setError('Failed to mark message as read');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/contact/messages/${id}`, authConfig);
      setSuccess('Message deleted successfully');
      fetchMessages();
      setSelectedMessage(null);
    } catch (err: any) {
      setError('Failed to delete message');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-messages-manager">
      <h2><i className="fas fa-envelope"></i> Contact Messages</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="messages-header mb-3">
        <span className="badge bg-primary">{messages.length} Total</span>
        {unreadCount > 0 && <span className="badge bg-warning ms-2">{unreadCount} Unread</span>}
      </div>

      <div className="row">
        {/* Messages List */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><i className="fas fa-inbox"></i> Messages ({messages.length})</h5>
            </div>
            <div className="card-body p-0">
              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-inbox fa-3x mb-3"></i>
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-item ${!msg.isRead ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'active' : ''}`}
                      onClick={() => setSelectedMessage(msg)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="message-preview">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">
                              {!msg.isRead && <i className="fas fa-circle text-warning me-2" style={{ fontSize: '8px' }}></i>}
                              {msg.name}
                            </h6>
                            <small className="text-muted">{msg.email}</small>
                          </div>
                          <small className="text-muted">{new Date(msg.submittedAt).toLocaleDateString()}</small>
                        </div>
                        <p className="mb-0 mt-2 text-truncate">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Details */}
        <div className="col-lg-6">
          {selectedMessage ? (
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0"><i className="fas fa-envelope-open"></i> Message Details</h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedMessage(null)}
                  ></button>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted">From</label>
                  <p className="mb-0"><strong>{selectedMessage.name}</strong></p>
                  <p className="mb-3"><a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">Date Received</label>
                  <p className="mb-3">{formatDate(selectedMessage.submittedAt)}</p>
                </div>

                {selectedMessage.isRead && selectedMessage.readAt && (
                  <div className="mb-3">
                    <label className="form-label text-muted">Marked as Read</label>
                    <p className="mb-3">{formatDate(selectedMessage.readAt)}</p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label text-muted">Message</label>
                  <div className="message-content p-3 border rounded" style={{ minHeight: '150px' }}>
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="message-actions d-flex gap-2">
                  {!selectedMessage.isRead && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                    >
                      <i className="fas fa-check me-1"></i>
                      Mark as Read
                    </button>
                  )}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message to Bianca`}
                    className="btn btn-sm btn-outline-info"
                  >
                    <i className="fas fa-reply me-1"></i>
                    Reply
                  </a>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center text-muted py-5">
                <i className="fas fa-envelope-open-text fa-3x mb-3"></i>
                <p>Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactMessagesManager;
