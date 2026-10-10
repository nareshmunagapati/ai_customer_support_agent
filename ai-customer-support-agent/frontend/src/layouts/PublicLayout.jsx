import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Bot, HelpCircle, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'SUPPORT_AGENT') return '/agent/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Bot size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Customer Support
            </span>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
              ENTERPRISE AGENT
            </span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/knowledge-base"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <HelpCircle size={17} /> Knowledge Base
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => navigate(getDashboardPath())}
              className="btn btn-primary btn-sm"
            >
              Go to Dashboard
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Public Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          fontSize: '0.88rem',
          borderTop: '1px solid #1e293b',
        }}
      >
        <p>© 2026 AI Customer Support Agent. Built with Spring Boot, MySQL, and React.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
          Demo Accounts: admin@example.com (Admin) | agent@example.com (Agent) | customer@example.com (Customer)
        </p>
      </footer>
    </div>
  );
}
