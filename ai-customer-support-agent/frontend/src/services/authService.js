import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/api/auth/register', data);
    return res.data;
  },

  async login(data) {
    const res = await api.post('/api/auth/login', data);
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/api/customers/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/api/customers/profile', data);
    return res.data;
  },
};
