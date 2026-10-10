import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { chatService } from '../../services/chatService';
import { feedbackService } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Ticket,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Star,
  User,
  Bot,
  MessageSquare,
  HelpCircle,
  XCircle
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/dateUtils';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const res = await ticketService.getTicketById(id);
      if (res.success && res.data) {
        setTicket(res.data);

        // Load conversation messages if conversationId is available
        if (res.data.conversationId) {
          const convRes = await chatService.getConversationMessages(res.data.conversationId);
          if (convRes.success) {
            setMessages(convRes.data || []);
          }
        }
      }
    } catch (err) {
      showToast('Could not load ticket details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    try {
      const res = await ticketService.escalateTicket(id);
      if (res.success) {
        showToast('Ticket escalated to priority support!', 'success');
        fetchTicketDetails();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to escalate ticket', 'error');
    }
  };

  const handleCloseTicket = async () => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      try {
        const res = await ticketService.updateTicketStatus(id, 'CLOSED');
        if (res.success) {
          showToast('Ticket marked as CLOSED', 'info');
          fetchTicketDetails();
        }
      } catch (err) {
        showToast('Failed to close ticket', 'error');
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await chatService.sendMessage({
        conversationId: ticket.conversationId,
        ticketId: ticket.id,
        message: replyText.trim(),
      });

      if (res.success) {
        setReplyText('');
        showToast('Message sent to support team', 'success');
        fetchTicketDetails();
      }
    } catch (err) {
      showToast('Failed to post reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await feedbackService.submitFeedback({
        ticketId: ticket.id,
        rating,
        comment: feedbackComment.trim(),
      });

      if (res.success) {
        showToast('Thank you! Your feedback has been recorded.', 'success');
        fetchTicketDetails();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit feedback', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket details..." />;
  }

  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h3>Ticket not found</h3>
        <button onClick={() => navigate('/customer/tickets')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Tickets
        </button>
      </div>
    );
  }

  const isResolvedOrClosed = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/customer/tickets')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to My Tickets
      </button>

      {/* Ticket Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                #{ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {ticket.subject}
            </h1>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {ticket.status !== 'ESCALATED' && !isResolvedOrClosed && (
              <button
                onClick={handleEscalate}
                className="btn btn-secondary btn-sm"
                style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
              >
                <AlertTriangle size={15} /> Escalate to Human Support
              </button>
            )}

            {!isResolvedOrClosed && (
              <button
                onClick={handleCloseTicket}
                className="btn btn-secondary btn-sm"
              >
                <XCircle size={15} /> Close Ticket
              </button>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', backgroundColor: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Category
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {ticket.category}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Assigned Specialist
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {ticket.assignedAgent ? ticket.assignedAgent.name : 'Waiting for Assignment'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Submitted On
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {formatDate(ticket.createdAt)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Last Updated
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {formatDate(ticket.updatedAt)}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Problem Description
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Feedback Section if Resolved or Closed */}
      {isResolvedOrClosed && (
        <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534' }}>
              Ticket Resolved
            </h3>
          </div>

          {ticket.feedback ? (
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Your Rating:</span>
                <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= ticket.feedback.rating ? '#f59e0b' : 'none'}
                    />
                  ))}
                </div>
              </div>
              {ticket.feedback.comment && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  "{ticket.feedback.comment}"
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                How would you rate our support service on this ticket?
              </h4>

              {/* Star Rating Selector */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: star <= rating ? '#f59e0b' : '#cbd5e1' }}
                  >
                    <Star size={28} fill={star <= rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Share details on your support experience..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-success btn-sm"
                disabled={submittingFeedback}
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Rating & Feedback'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Connected Conversation History / Agent Replies */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} /> Support Conversation & Updates
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {messages.length} messages
          </span>
        </div>

        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No conversation transcript attached to this ticket yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {messages.map((m) => {
              const isCust = m.senderType === 'CUSTOMER';
              const isAgent = m.senderType === 'AGENT';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignSelf: isCust ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  {!isCust && (
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        backgroundColor: isAgent ? '#059669' : 'var(--primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isAgent ? <User size={18} /> : <Bot size={18} />}
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isCust ? 'var(--primary)' : isAgent ? '#ecfdf5' : '#ffffff',
                        color: isCust ? '#ffffff' : 'var(--text-primary)',
                        border: isCust ? 'none' : isAgent ? '1px solid #a7f3d0' : '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.message}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isCust ? 'right' : 'left' }}>
                      {isCust ? 'You' : isAgent ? (ticket.assignedAgent?.name || 'Support Agent') : 'SupportAI'} • {formatDate(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Customer Reply Input (if not closed) */}
        {!isResolvedOrClosed && (
          <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Send an update or question to the support agent..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={sendingReply}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!replyText.trim() || sendingReply}
            >
              <Send size={18} /> Reply
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
