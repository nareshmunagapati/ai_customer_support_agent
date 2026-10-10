import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agentService } from '../../services/agentService';
import { useAuth } from '../../context/AuthContext';
import {
  Headphones,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ArrowRight,
  User,
  MessageSquare
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/dateUtils';

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentTickets();
  }, []);

  const fetchAgentTickets = async () => {
    setLoading(true);
    try {
      const res = await agentService.getAgentTickets();
      if (res.success) {
        setTickets(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load agent tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const assignedCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const escalatedCount = tickets.filter((t) => t.status === 'ESCALATED').length;
  const highPriorityCount = tickets.filter(
    (t) => t.priority === 'HIGH' || t.priority === 'URGENT'
  ).length;

  if (loading) {
    return <LoadingSpinner message="Loading support agent workspace..." />;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Support Agent Workspace
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Welcome, {user?.name}. Monitor and resolve escalated customer tickets.
          </p>
        </div>

        <Link to="/agent/tickets" className="btn btn-primary">
          View All Assigned ({tickets.length})
        </Link>
      </div>

      {/* Metrics */}
      <div className="stat-grid">
        <StatCard
          label="Total Assigned"
          value={assignedCount}
          icon={Headphones}
          color="#4f46e5"
          bg="#eef2ff"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={Clock}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <StatCard
          label="Escalated Tickets"
          value={escalatedCount}
          icon={AlertTriangle}
          color="#ef4444"
          bg="#fef2f2"
        />
        <StatCard
          label="High / Urgent"
          value={highPriorityCount}
          icon={Flame}
          color="#ea580c"
          bg="#fff7ed"
        />
      </div>

      {/* Assigned Tickets Priority Queue */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Assigned Tickets Requiring Action</h3>
          <Link to="/agent/tickets" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            All assigned <ArrowRight size={14} />
          </Link>
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            icon={Headphones}
            title="No tickets currently assigned to you"
            description="All clear! Tickets assigned by administrators or routed to you will appear here."
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 8).map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/agent/tickets/${t.id}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        #{t.id} - {t.subject}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>
                        {t.customer.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.customer.email}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {formatDate(t.createdAt)}
                    </td>
                    <td>
                      <Link
                        to={`/agent/tickets/${t.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        Respond <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
