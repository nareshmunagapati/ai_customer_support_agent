import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Ticket, Search, UserCheck, ArrowRight, UserPlus, Filter } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/dateUtils';

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketRes, userRes] = await Promise.all([
        adminService.getAllTickets(),
        adminService.getAllUsers(),
      ]);

      if (ticketRes.success) setTickets(ticketRes.data || []);
      if (userRes.success) {
        const agentList = (userRes.data || []).filter(
          (u) => u.role === 'SUPPORT_AGENT' || u.role === 'ADMIN'
        );
        setAgents(agentList);
      }
    } catch (err) {
      console.error('Failed to load tickets/agents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedAgentId(ticket.assignedAgent ? ticket.assignedAgent.id.toString() : '');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgentId || !selectedTicket) return;

    setAssigning(true);
    try {
      const res = await adminService.assignTicket(selectedTicket.id, Number(selectedAgentId));
      if (res.success) {
        showToast('Ticket assigned successfully!', 'success');
        setAssignModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign ticket', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toString().includes(searchTerm) ||
      (t.customer && t.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Manage Support Tickets
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Assign tickets to agents, track escalation queues, and oversee resolutions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by ticket ID, subject, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ minWidth: 160 }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_CUSTOMER">Waiting for Customer</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div style={{ minWidth: 160 }}>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading all tickets..." />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No support tickets found"
          description="No tickets matched your filter criteria."
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Specialist</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        #{t.id} - {t.subject}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.description}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>
                        {t.customer.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.customer.email}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      {t.assignedAgent ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>
                          <UserCheck size={15} /> {t.assignedAgent.name}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(t)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.78rem', color: 'var(--primary)' }}
                        >
                          <UserPlus size={13} /> Assign
                        </button>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {formatDate(t.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenAssignModal(t)}
                          className="btn btn-secondary btn-sm"
                          title="Assign or reassign agent"
                        >
                          Reassign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Ticket #${selectedTicket?.id}`}
      >
        <form onSubmit={handleAssignSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <strong>Subject:</strong> {selectedTicket?.subject}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Customer:</strong> {selectedTicket?.customer?.name} ({selectedTicket?.customer?.email})
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Select Support Agent</label>
            <select
              className="form-select"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              required
            >
              <option value="">-- Choose Agent --</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.email}) - {agent.role}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAssignModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedAgentId || assigning}
            >
              {assigning ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
