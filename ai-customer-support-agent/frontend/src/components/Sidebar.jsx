import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  LayoutDashboard,
  MessageSquare,
  Ticket,
  PlusCircle,
  History,
  User,
  Star,
  Users,
  BookOpen,
  Headphones,
  Shield,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isCustomer, isAgent, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.92rem',
    transition: 'all 0.15s ease',
    marginBottom: '0.35rem',
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-primary)',
          color: '#ffffff',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transform: isOpen || window.innerWidth > 900 ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand / Logo */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Bot size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              SupportAI
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600,
              }}
            >
              {user?.role ? user.role.replace('_', ' ') : 'Agent'}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav style={{ flex: 1, padding: '1.25rem 1rem', overflowY: 'auto' }}>
          {/* Customer Navigation */}
          {isCustomer && (
            <>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, padding: '0 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
                Customer Portal
              </div>
              <NavLink to="/customer/dashboard" style={navLinkStyle} onClick={onClose}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
              <NavLink to="/customer/chat" style={navLinkStyle} onClick={onClose}>
                <MessageSquare size={18} /> AI Support Chat
              </NavLink>
              <NavLink to="/customer/tickets/new" style={navLinkStyle} onClick={onClose}>
                <PlusCircle size={18} /> Create Ticket
              </NavLink>
              <NavLink to="/customer/tickets" style={navLinkStyle} onClick={onClose}>
                <Ticket size={18} /> My Tickets
              </NavLink>
              <NavLink to="/customer/history" style={navLinkStyle} onClick={onClose}>
                <History size={18} /> Chat History
              </NavLink>
              <NavLink to="/customer/feedback" style={navLinkStyle} onClick={onClose}>
                <Star size={18} /> My Feedback
              </NavLink>
              <NavLink to="/customer/profile" style={navLinkStyle} onClick={onClose}>
                <User size={18} /> Profile
              </NavLink>
            </>
          )}

          {/* Support Agent Navigation */}
          {isAgent && (
            <>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, padding: '0 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
                Agent Portal
              </div>
              <NavLink to="/agent/dashboard" style={navLinkStyle} onClick={onClose}>
                <LayoutDashboard size={18} /> Agent Dashboard
              </NavLink>
              <NavLink to="/agent/tickets" style={navLinkStyle} onClick={onClose}>
                <Headphones size={18} /> Assigned Tickets
              </NavLink>
              <NavLink to="/knowledge-base" style={navLinkStyle} onClick={onClose}>
                <BookOpen size={18} /> Knowledge Base
              </NavLink>
            </>
          )}

          {/* Administrator Navigation */}
          {isAdmin && (
            <>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, padding: '0 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
                Administrator
              </div>
              <NavLink to="/admin/dashboard" style={navLinkStyle} onClick={onClose}>
                <Shield size={18} /> Admin Dashboard
              </NavLink>
              <NavLink to="/admin/users" style={navLinkStyle} onClick={onClose}>
                <Users size={18} /> Manage Users
              </NavLink>
              <NavLink to="/admin/tickets" style={navLinkStyle} onClick={onClose}>
                <Ticket size={18} /> Manage All Tickets
              </NavLink>
              <NavLink to="/admin/knowledge-base" style={navLinkStyle} onClick={onClose}>
                <BookOpen size={18} /> Knowledge Base
              </NavLink>
              <NavLink to="/admin/feedback" style={navLinkStyle} onClick={onClose}>
                <Star size={18} /> Customer Feedback
              </NavLink>
            </>
          )}
        </nav>

        {/* User Footer Profile & Logout */}
        <div
          style={{
            padding: '1.25rem',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#334155',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem',
              backgroundColor: '#1e293b',
              color: '#f87171',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
