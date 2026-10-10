import api from './api';

export const kbService = {
  async searchArticles(query = '') {
    const res = await api.get('/api/knowledge-base/search', {
      params: { query },
    });
    return res.data;
  },

  async getAllArticles() {
    const res = await api.get('/api/knowledge-base');
    return res.data;
  },

  async getArticleById(id) {
    const res = await api.get(`/api/knowledge-base/${id}`);
    return res.data;
  },
};
