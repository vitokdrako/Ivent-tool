import api from './axios';

export const categoriesAPI = {
  getCategories: async (parentId) => {
    const params = parentId ? { parent_id: parentId } : {};
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getSubcategories: async (categoryName) => {
    const params = categoryName ? { category_name: categoryName } : {};
    const response = await api.get('/subcategories', { params });
    return response.data;
  },

  getAllSubcategories: async () => {
    const response = await api.get('/subcategories');
    return response.data;
  },
};