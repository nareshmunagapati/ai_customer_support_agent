import React from 'react';
import { ArrowDown, Minus, ArrowUp, Flame } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  if (!priority) return null;

  const normalized = priority.toUpperCase();

  switch (normalized) {
    case 'LOW':
      return (
        <span className="badge badge-priority-low">
          <ArrowDown size={12} /> Low
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="badge badge-priority-medium">
          <Minus size={12} /> Medium
        </span>
      );
    case 'HIGH':
      return (
        <span className="badge badge-priority-high">
          <ArrowUp size={12} /> High
        </span>
      );
    case 'URGENT':
      return (
        <span className="badge badge-priority-urgent">
          <Flame size={12} /> Urgent
        </span>
      );
    default:
      return <span className="badge badge-priority-low">{priority}</span>;
  }
}
