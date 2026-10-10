import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Headphones, Shield, Sparkles, MessageSquare, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'SUPPORT_AGENT') return '/agent/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          color: '#ffffff',
          padding: '5rem 2rem 6rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(79, 70, 229, 0.25)',
              border: '1px solid rgba(129, 140, 248, 0.4)',
              color: '#c7d2fe',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} /> 24/7 Intelligent Customer Support Platform
          </div>

          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Instant AI Solutions with Seamless Human Agent Escalation
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: 700,
              margin: '0 auto 2.5rem',
            }}
          >
            Empower your customers with automated answers, instant knowledge search, intelligent query classification, and direct ticket routing to human support agents.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn btn-primary btn-lg">
                Enter Your Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/customer/chat" className="btn btn-primary btn-lg">
                  <Bot size={20} /> Try AI Chat Support
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Sign In to Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ maxWidth: 1200, margin: '-2.5rem auto 5rem', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Bot size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>Automated AI Responses</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Instant answers backed by MySQL knowledge base matching and intent classification across login, payment, delivery, and refunds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Headphones size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>Human Agent Hand-off</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Unresolved issues effortlessly escalate into tracked support tickets assigned to qualified agents who view full chat history.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Shield size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>Admin Control & Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Centralized visibility into user roles, ticket workload distribution, customer feedback ratings, and knowledge base articles.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Accounts Quick-Fill Guide */}
      <section style={{ maxWidth: 1000, margin: '0 auto 5rem', padding: '0 1.5rem' }}>
        <div className="card" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quick Start Demo Accounts</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Test each role immediately using pre-configured test credentials (password: <code>Password123!</code>):
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#4f46e5', marginBottom: '0.5rem' }}>
                <Bot size={18} /> Customer Role
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Email: <strong>customer@example.com</strong><br />
                Password: <strong>Password123!</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Access chatbot, submit tickets, track statuses, rate support.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
                <Headphones size={18} /> Support Agent Role
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Email: <strong>agent@example.com</strong><br />
                Password: <strong>Password123!</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Review assigned tickets, view user chat logs, reply and resolve.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem' }}>
                <Shield size={18} /> Administrator Role
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Email: <strong>admin@example.com</strong><br />
                Password: <strong>Password123!</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Full analytics, assign tickets to agents, edit knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
