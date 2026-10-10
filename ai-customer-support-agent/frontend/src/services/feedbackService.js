import api from './api';

export const feedbackService = {
  async submitFeedback({ ticketId, rating, comment }) {
    const res = await api.post('/api/feedback', { ticketId, rating, comment });
    return res.data;
  },

  async getMyFeedback() {
    const res = await api.get('/api/feedback/my');
    return res.data;
  },
};
