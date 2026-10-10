import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { MessageSquare, Bot, PlusCircle, ArrowRight, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../context/ToastContext';

export default function ConversationHistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await chatService.getConversations();
      if (res.success) {
        setConversations(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Clear all messages in this conversation session?')) {
      try {
        await chatService.clearConversation(id);
        showToast('Conversation cleared', 'info');
        fetchConversations();
      } catch (err) {
        showToast('Failed to clear conversation', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            AI Conversation History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Review past chat dialogues, automated troubleshooting steps, and responses.
          </p>
        </div>

        <Link to="/customer/chat" className="btn btn-primary">
          <PlusCircle size={18} /> New AI Chat
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading chat history..." />
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No chat sessions yet"
          description="Start a chat with our AI Support Assistant to get quick answers."
          actionButton={
            <Link to="/customer/chat" className="btn btn-primary btn-sm">
              Start Your First Chat
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {conversations.map((c) => (
            <div
              key={c.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    <Bot size={18} /> Session #{c.id}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {formatDate(c.lastMessageTime || c.createdAt)}
                  </span>
                </div>

                {c.ticketId && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      Linked to Ticket #{c.ticketId}
                    </span>
                  </div>
                )}

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  "{c.lastMessage}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {c.messageCount} messages
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => handleClear(c.id, e)}
                    className="btn btn-secondary btn-sm"
                    title="Clear transcript"
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                  <Link
                    to={`/customer/chat?conversationId=${c.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Resume <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
