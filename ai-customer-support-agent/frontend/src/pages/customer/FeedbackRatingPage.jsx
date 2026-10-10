import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feedbackService } from '../../services/feedbackService';
import { ticketService } from '../../services/ticketService';
import { Star, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/dateUtils';

export default function FeedbackRatingPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feedbackRes, ticketRes] = await Promise.all([
        feedbackService.getMyFeedback(),
        ticketService.getTickets(),
      ]);

      if (feedbackRes.success) setFeedbacks(feedbackRes.data || []);
      if (ticketRes.success) setTickets(ticketRes.data || []);
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingFeedbackTickets = tickets.filter(
    (t) => (t.status === 'RESOLVED' || t.status === 'CLOSED') && !t.feedback
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          My Support Feedback & Ratings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Your honest reviews help us continuously improve our AI agent and human support team.
        </p>
      </div>

      {/* Tickets Awaiting Feedback Banner */}
      {pendingFeedbackTickets.length > 0 && (
        <div className="card" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>
            Tickets Awaiting Your Review ({pendingFeedbackTickets.length})
          </h3>
          <p style={{ color: '#b45309', fontSize: '0.88rem', marginBottom: '1rem' }}>
            These tickets have been resolved. Please take a moment to rate the service received:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingFeedbackTickets.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #fde68a',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                    #{t.id} - {t.subject}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Resolved on {formatDate(t.resolvedAt || t.updatedAt)}
                  </div>
                </div>

                <Link to={`/customer/tickets/${t.id}`} className="btn btn-primary btn-sm">
                  Rate Ticket <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Submitted Feedback */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Submitted Ratings</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {feedbacks.length} ratings
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading feedback history..." />
        ) : feedbacks.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No feedback submitted yet"
            description="Once your support tickets are marked resolved, you can provide ratings here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map((f) => (
              <div
                key={f.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-muted)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Link
                    to={`/customer/tickets/${f.ticketId}`}
                    style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}
                  >
                    Ticket #{f.ticketId}
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(f.createdAt)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '0.65rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} fill={s <= f.rating ? '#f59e0b' : 'none'} />
                  ))}
                </div>

                {f.comment && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{f.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
