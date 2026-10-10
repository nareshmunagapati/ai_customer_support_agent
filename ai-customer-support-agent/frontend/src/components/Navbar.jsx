import React from 'react';
import { Menu, Bell, HelpCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const { user, isCustomer } = useAuth();

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          AI Customer Support
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Link
          to="/knowledge-base"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-muted)',
          }}
        >
          <HelpCircle size={16} /> Knowledge Base
        </Link>

        {isCustomer && (
          <Link to="/customer/chat" className="btn btn-primary btn-sm">
            Instant AI Help
          </Link>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {user?.name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
