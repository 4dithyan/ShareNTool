import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/accounts/login/', { username, password });
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post('/accounts/signup/', userData);
    return response.data;
  },
  getProfile: async (userId) => {
    const response = await api.get('/accounts/profile/', {
      params: userId ? { userId } : {}
    });
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/accounts/profile/', data);
    return response.data;
  },
  getDummyUsers: async () => {
    const response = await api.get('/accounts/dummy-users/');
    return response.data;
  }
};

