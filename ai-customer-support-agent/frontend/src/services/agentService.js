import api from './api';

export const agentService = {
  async getAgentTickets() {
    const res = await api.get('/api/agent/tickets');
    return res.data;
  },

  async replyToTicket(ticketId, message, status = null) {
    const res = await api.post(`/api/agent/tickets/${ticketId}/reply`, {
      message,
      status,
    });
    return res.data;
  },

  async updateTicketStatus(ticketId, status) {
    const res = await api.put(`/api/agent/tickets/${ticketId}/status`, {
      status,
    });
    return res.data;
  },
};
