import React from 'react';
import { AlertCircle, Clock, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'OPEN':
      return (
        <span className="badge badge-open">
          <HelpCircle size={12} /> Open
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="badge badge-in_progress">
          <Clock size={12} /> In Progress
        </span>
      );
    case 'WAITING_FOR_CUSTOMER':
      return (
        <span className="badge badge-waiting_for_customer">
          <Clock size={12} /> Waiting on Customer
        </span>
      );
    case 'ESCALATED':
      return (
        <span className="badge badge-escalated">
          <AlertTriangle size={12} /> Escalated
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="badge badge-resolved">
          <CheckCircle2 size={12} /> Resolved
        </span>
      );
    case 'CLOSED':
      return (
        <span className="badge badge-closed">
          <XCircle size={12} /> Closed
        </span>
      );
    default:
      return <span className="badge badge-closed">{status}</span>;
  }
}
