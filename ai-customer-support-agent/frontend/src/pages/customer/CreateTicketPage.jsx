import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { useToast } from '../../context/ToastContext';
import { Ticket, PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';

export default function CreateTicketPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'General queries';
  const initialSubject = searchParams.get('subject') || '';
  const initialConvId = searchParams.get('conversationId') || '';

  const [subject, setSubject] = useState(initialSubject);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [priority, setPriority] = useState('MEDIUM');
  const [conversationId, setConversationId] = useState(initialConvId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = [
    'Account and login',
    'Payment',
    'Orders and delivery',
    'Refund',
    'Technical issues',
    'Product information',
    'Complaints',
    'General queries',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!subject.trim() || !description.trim()) {
      setError('Please provide both a subject and a detailed description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await ticketService.createTicket({
        subject: subject.trim(),
        description: description.trim(),
        category,
        priority,
        conversationId: conversationId ? Number(conversationId) : null,
      });

      if (res.success && res.data) {
        showToast('Ticket created successfully! Our team will review it.', 'success');
        navigate(`/customer/tickets/${res.data.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create ticket';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 750, margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Ticket size={24} color="var(--primary)" /> Create Support Ticket
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Submit your issue directly to our human customer support specialists.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ticket Subject *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Cannot complete payment for invoice #4928"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (Service impacting)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Describe your issue, steps already attempted, transaction IDs, or error codes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {conversationId && (
            <div
              style={{
                backgroundColor: 'var(--bg-muted)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} color="var(--primary)" />
              Linking previous chat session #{conversationId} to give agents full diagnostic context.
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/customer/tickets')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting Ticket...' : <><PlusCircle size={18} /> Submit Ticket</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
