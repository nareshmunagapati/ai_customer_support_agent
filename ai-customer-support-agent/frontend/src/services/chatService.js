import api from './api';

export const chatService = {
  async sendMessage({ conversationId, ticketId, message }) {
    const res = await api.post('/api/chat/message', {
      conversationId,
      ticketId,
      message,
    });
    return res.data;
  },

  async getConversations() {
    const res = await api.get('/api/chat/conversations');
    return res.data;
  },

  async getConversationMessages(conversationId) {
    const res = await api.get(`/api/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  async clearConversation(conversationId) {
    const res = await api.delete(`/api/chat/conversations/${conversationId}`);
    return res.data;
  },
};
