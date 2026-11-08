import api from './api';

export const toolService = {
  getAllTools: async (params = {}) => {
    const response = await api.get('/tools/', { params });
    return response.data;
  },
  getToolById: async (id) => {
    const response = await api.get(`/tools/${id}/`);
    return response.data;
  },
  createTool: async (toolData) => {
    const response = await api.post('/tools/', toolData);
    return response.data;
  },
  updateTool: async (id, toolData) => {
    const response = await api.put(`/tools/${id}/`, toolData);
    return response.data;
  },
  deleteTool: async (id) => {
    const response = await api.delete(`/tools/${id}/`);
    return response.data;
  },
  getMyTools: async (userId) => {
    const response = await api.get('/tools/my_tools/', {
      params: userId ? { userId } : {}
    });
    return response.data;
  },
  getToolReviews: async (toolId) => {
    const response = await api.get('/reviews/', { params: { tool_id: toolId } });
    return response.data;
  },
  addReview: async (reviewData) => {
    const response = await api.post('/reviews/', reviewData);
    return response.data;
  }
};

