import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No items found', description = 'There is currently no data to display.', actionButton = null }) {
  return (
    <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 1.25rem' }}>{description}</p>
      {actionButton}
    </div>
  );
}
