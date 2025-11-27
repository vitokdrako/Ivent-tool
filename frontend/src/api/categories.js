import api from './axios';

export const categoriesAPI = {
  getCategories: async (parentId) => {
    const params = parentId ? { parent_id: parentId } : {};
    const response = await api.get('/categories', { params });
    return response.data;
  },
};