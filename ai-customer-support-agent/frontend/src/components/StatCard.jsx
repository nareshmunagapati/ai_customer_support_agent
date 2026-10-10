import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'var(--primary)', bg = 'var(--primary-light)' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value !== undefined && value !== null ? value : 0}</div>
      </div>
      <div className="stat-icon" style={{ backgroundColor: bg, color }}>
        <Icon size={24} />
      </div>
    </div>
  );
}
