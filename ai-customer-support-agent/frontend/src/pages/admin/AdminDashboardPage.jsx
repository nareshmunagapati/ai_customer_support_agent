import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import {
  Users,
  Headphones,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating support analytics..." />;
  }

  const {
    totalCustomers = 0,
    totalAgents = 0,
    totalTickets = 0,
    openTickets = 0,
    inProgressTickets = 0,
    escalatedTickets = 0,
    resolvedTickets = 0,
    averageRating = 0,
    totalFeedbackCount = 0,
    ticketsByStatus = {},
    ticketsByCategory = {},
    ticketsByPriority = {},
  } = analytics || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            System Administration & Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Real-time platform metrics, ticket distribution, and performance data from MySQL.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/tickets" className="btn btn-primary">
            Manage All Tickets
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            Manage Users
          </Link>
        </div>
      </div>

      {/* High-level KPI grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Customers"
          value={totalCustomers}
          icon={Users}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <StatCard
          label="Support Agents"
          value={totalAgents}
          icon={Headphones}
          color="#8b5cf6"
          bg="#f5f3ff"
        />
        <StatCard
          label="Total Tickets"
          value={totalTickets}
          icon={Ticket}
          color="#4f46e5"
          bg="#eef2ff"
        />
        <StatCard
          label="Open Tickets"
          value={openTickets}
          icon={Clock}
          color="#0ea5e9"
          bg="#e0f2fe"
        />
        <StatCard
          label="Escalated to Agents"
          value={escalatedTickets}
          icon={AlertTriangle}
          color="#ef4444"
          bg="#fef2f2"
        />
        <StatCard
          label="Resolved Tickets"
          value={resolvedTickets}
          icon={CheckCircle2}
          color="#10b981"
          bg="#ecfdf5"
        />
        <StatCard
          label="Avg Customer Rating"
          value={averageRating ? `${averageRating} / 5` : 'N/A'}
          icon={Star}
          color="#f59e0b"
          bg="#fffbeb"
        />
        <StatCard
          label="Total Feedback"
          value={totalFeedbackCount}
          icon={BarChart3}
          color="#065f46"
          bg="#f0fdf4"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Tickets By Category */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tickets by Category</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.keys(ticketsByCategory).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data available</div>
            ) : (
              Object.entries(ticketsByCategory).map(([cat, count]) => {
                const pct = totalTickets ? Math.round((count / totalTickets) * 100) : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, backgroundColor: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tickets By Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tickets by Status</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.keys(ticketsByStatus).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data available</div>
            ) : (
              Object.entries(ticketsByStatus).map(([status, count]) => {
                const pct = totalTickets ? Math.round((count / totalTickets) * 100) : 0;
                let color = 'var(--primary)';
                if (status === 'ESCALATED') color = '#ef4444';
                if (status === 'RESOLVED') color = '#10b981';
                if (status === 'IN_PROGRESS') color = '#f59e0b';

                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600 }}>{status.replace(/_/g, ' ')}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, backgroundColor: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: color,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tickets By Priority */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tickets by Priority</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.keys(ticketsByPriority).length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data available</div>
            ) : (
              Object.entries(ticketsByPriority).map(([pri, count]) => {
                const pct = totalTickets ? Math.round((count / totalTickets) * 100) : 0;
                let color = '#475569';
                if (pri === 'URGENT') color = '#dc2626';
                if (pri === 'HIGH') color = '#ea580c';
                if (pri === 'MEDIUM') color = '#16a34a';

                return (
                  <div key={pri}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600 }}>{pri}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, backgroundColor: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: color,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
