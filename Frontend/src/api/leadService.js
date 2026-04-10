import api from './authService.js';

export const getLeads = async (companyId) => {
  try {
    const response = await api.get(`/leads/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch leads' };
  }
};

export const getLead = async (id) => {
  try {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch lead' };
  }
};

export const createLead = async (companyId, name, phone, address, status = 'new') => {
  try {
    const response = await api.post('/leads', {
      companyId,
      name,
      phone,
      address,
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create lead' };
  }
};

export const updateLead = async (id, { name, phone, address, status }) => {
  try {
    const response = await api.patch(`/leads/${id}`, {
      name,
      phone,
      address,
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update lead' };
  }
};

export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete lead' };
  }
};

export const syncLeads = async () => {
  try {
    const response = await api.post('/sync/leads');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to sync leads' };
  }
};
