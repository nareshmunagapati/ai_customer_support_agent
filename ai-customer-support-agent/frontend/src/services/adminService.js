import api from './api';

export const adminService = {
  async getAllUsers() {
    const res = await api.get('/api/admin/users');
    return res.data;
  },

  async getAllTickets() {
    const res = await api.get('/api/admin/tickets');
    return res.data;
  },

  async assignTicket(ticketId, agentId) {
    const res = await api.put(`/api/admin/tickets/${ticketId}/assign`, {
      agentId,
    });
    return res.data;
  },

  async getAnalytics() {
    const res = await api.get('/api/admin/analytics');
    return res.data;
  },

  async createKnowledgeBaseArticle(data) {
    const res = await api.post('/api/admin/knowledge-base', data);
    return res.data;
  },

  async updateKnowledgeBaseArticle(id, data) {
    const res = await api.put(`/api/admin/knowledge-base/${id}`, data);
    return res.data;
  },

  async deleteKnowledgeBaseArticle(id) {
    const res = await api.delete(`/api/admin/knowledge-base/${id}`);
    return res.data;
  },

  async getAllFeedback() {
    const res = await api.get('/api/admin/feedback');
    return res.data;
  },
};
