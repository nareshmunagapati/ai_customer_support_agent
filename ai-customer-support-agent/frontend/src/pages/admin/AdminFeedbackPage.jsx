import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Star, MessageSquare, ArrowRight, User } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/dateUtils';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllFeedback();
      if (res.success) {
        setFeedbacks(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        ).toFixed(1)
      : '0.0';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Customer Feedback & Satisfaction
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Customer ratings and comments collected after support ticket resolution.
          </p>
        </div>

        <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
              Average Rating
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" /> {avgRating} / 5.0
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #fde68a', paddingLeft: '1rem', fontSize: '0.85rem', color: '#92400e' }}>
            {feedbacks.length} total reviews
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading customer feedback..." />
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No feedback records yet"
          description="Customer reviews submitted on resolved tickets will appear here."
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Review Comment</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        Ticket #{f.ticketId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>
                        {f.customerName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        User ID: #{f.customerId}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.15rem', color: '#f59e0b' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={15} fill={s <= f.rating ? '#f59e0b' : 'none'} />
                        ))}
                      </div>
                    </td>
                    <td>
                      {f.comment ? (
                        <span style={{ fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                          "{f.comment}"
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          (No comment provided)
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {formatDate(f.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
