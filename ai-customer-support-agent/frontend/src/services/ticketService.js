import api from './api';

export const ticketService = {
  async getTickets() {
    const res = await api.get('/api/tickets');
    return res.data;
  },

  async getTicketById(id) {
    const res = await api.get(`/api/tickets/${id}`);
    return res.data;
  },

  async createTicket(data) {
    const res = await api.post('/api/tickets', data);
    return res.data;
  },

  async updateTicketStatus(id, status, comment = '') {
    const res = await api.put(`/api/tickets/${id}/status`, { status, comment });
    return res.data;
  },

  async escalateTicket(id) {
    const res = await api.post(`/api/tickets/${id}/escalate`);
    return res.data;
  },
};
