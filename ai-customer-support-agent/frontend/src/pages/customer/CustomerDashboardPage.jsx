import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import {
  Ticket,
  CheckCircle2,
  Clock,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  Bot,
  AlertTriangle
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/dateUtils';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ticketRes, convRes] = await Promise.all([
        ticketService.getTickets(),
        chatService.getConversations(),
      ]);

      if (ticketRes.success) setTickets(ticketRes.data || []);
      if (convRes.success) setConversations(convRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const activeTickets = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_CUSTOMER' || t.status === 'ESCALATED'
  );
  const resolvedTickets = tickets.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
  );
  const escalatedTickets = tickets.filter((t) => t.status === 'ESCALATED');

  if (loading) {
    return <LoadingSpinner message="Loading customer dashboard..." />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            Welcome back, {user?.name || 'Customer'}! 👋
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: 600 }}>
            Need help? Ask our 24/7 AI chatbot for instant solutions or create a support ticket to work directly with a human specialist.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/customer/chat" className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 600 }}>
            <Bot size={18} /> Start AI Chat
          </Link>
          <Link to="/customer/tickets/new" className="btn btn-primary" style={{ backgroundColor: '#1e1b4b', borderColor: 'rgba(255,255,255,0.2)' }}>
            <PlusCircle size={18} /> Create Ticket
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stat-grid">
        <StatCard
          label="Active Tickets"
          value={activeTickets.length}
          icon={Clock}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <StatCard
          label="Resolved Tickets"
          value={resolvedTickets.length}
          icon={CheckCircle2}
          color="#10b981"
          bg="#ecfdf5"
        />
        <StatCard
          label="Escalated to Agent"
          value={escalatedTickets.length}
          icon={AlertTriangle}
          color="#ef4444"
          bg="#fef2f2"
        />
        <StatCard
          label="Chat Sessions"
          value={conversations.length}
          icon={MessageSquare}
          color="#8b5cf6"
          bg="#f5f3ff"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Tickets Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Support Tickets</h3>
            <Link to="/customer/tickets" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {tickets.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No tickets yet"
              description="Have an issue? Create a support ticket or chat with our AI agent."
              actionButton={
                <Link to="/customer/tickets/new" className="btn btn-primary btn-sm">
                  Create Support Ticket
                </Link>
              }
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map((t) => (
                    <tr key={t.id}>
                      <td>
                        <Link
                          to={`/customer/tickets/${t.id}`}
                          style={{ fontWeight: 600, color: 'var(--primary)' }}
                        >
                          #{t.id} - {t.subject}
                        </Link>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {t.category}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td>
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {formatDate(t.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent AI Conversations</h3>
            <Link to="/customer/history" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              All history <ArrowRight size={14} />
            </Link>
          </div>

          {conversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No chats started"
              description="Ask our AI agent any question to test automated troubleshooting."
              actionButton={
                <Link to="/customer/chat" className="btn btn-primary btn-sm">
                  Launch AI Chat
                </Link>
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {conversations.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to={`/customer/chat?conversationId=${c.id}`}
                  style={{
                    display: 'block',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-muted)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Bot size={15} color="var(--primary)" /> Session #{c.id}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDate(c.lastMessageTime || c.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.lastMessage}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
