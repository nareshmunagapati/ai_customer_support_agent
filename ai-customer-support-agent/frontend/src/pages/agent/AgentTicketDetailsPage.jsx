import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { agentService } from '../../services/agentService';
import { chatService } from '../../services/chatService';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Headphones,
  User,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/dateUtils';

export default function AgentTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await ticketService.getTicketById(id);
      if (res.success && res.data) {
        setTicket(res.data);
        setNewStatus(res.data.status);

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

  const handleStatusChange = async (statusToSet) => {
    setUpdatingStatus(true);
    try {
      const res = await agentService.updateTicketStatus(id, statusToSet);
      if (res.success) {
        showToast(`Ticket status updated to ${statusToSet}`, 'success');
        setTicket(res.data);
        setNewStatus(statusToSet);
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await agentService.replyToTicket(id, replyMessage.trim(), newStatus);
      if (res.success) {
        showToast('Reply dispatched to customer', 'success');
        setReplyMessage('');
        fetchDetails();
      }
    } catch (err) {
      showToast('Failed to send reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket details for agent..." />;
  }

  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h3>Ticket not found</h3>
        <button onClick={() => navigate('/agent/tickets')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Assigned Tickets
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/agent/tickets')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to Assigned Tickets
      </button>

      {/* Ticket Overview Card */}
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

          {/* Quick Status Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Status:
            </span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_CUSTOMER">Waiting for Customer</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Customer Information Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', backgroundColor: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Customer Details
            </span>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {ticket.customer?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {ticket.customer?.email}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Category
            </span>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {ticket.category}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Submitted Time
            </span>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {formatDate(ticket.createdAt)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Assigned Specialist
            </span>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {ticket.assignedAgent?.name || 'Unassigned'}
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Customer's Initial Description:
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Conversation Thread & Agent Reply Box */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer & AI Conversation Log</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {messages.length} messages
          </span>
        </div>

        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No previous chat transcript attached to this ticket.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {messages.map((m) => {
              const isCust = m.senderType === 'CUSTOMER';
              const isAgent = m.senderType === 'AGENT';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignSelf: isCust ? 'flex-start' : 'flex-end',
                    maxWidth: '80%',
                  }}
                >
                  {isCust && (
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        backgroundColor: '#334155',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <User size={18} />
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isAgent ? '#059669' : isCust ? '#ffffff' : 'var(--bg-muted)',
                        color: isAgent ? '#ffffff' : 'var(--text-primary)',
                        border: isAgent ? 'none' : '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.message}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isCust ? 'left' : 'right' }}>
                      {isCust ? ticket.customer?.name : isAgent ? 'Support Agent' : 'SupportAI'} • {formatDate(m.createdAt)}
                    </div>
                  </div>

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
                      {isAgent ? <Headphones size={18} /> : <Bot size={18} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Agent Reply Input Section */}
        <form onSubmit={handleSendReply} style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Reply to Customer
          </h4>

          <div className="form-group">
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Write an informative, helpful reply to the customer..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Set status after reply:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.65rem' }}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="WAITING_FOR_CUSTOMER">Waiting for Customer</option>
                <option value="IN_PROGRESS">Keep In Progress</option>
                <option value="RESOLVED">Mark as Resolved</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!replyMessage.trim() || sendingReply}
            >
              <Send size={18} /> {sendingReply ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
