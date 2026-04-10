import api from './authService.js';

export const getCompanies = async () => {
  try {
    const response = await api.get('/companies');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch companies' };
  }
};

export const getCompany = async (id) => {
  try {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch company' };
  }
};

export const createCompany = async (name) => {
  try {
    const response = await api.post('/companies', { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create company' };
  }
};

export const updateCompany = async (id, name) => {
  try {
    const response = await api.patch(`/companies/${id}`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update company' };
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete company' };
  }
};
