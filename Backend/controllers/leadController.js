import { getLeadsByCompany, getLeadById, createLead, updateLead, deleteLead } from '../models/Lead.js';

export const listLeads = async (req, res) => {
  try {
    const { companyId } = req.params;
    const leads = await getLeadsByCompany(companyId);
    res.json(leads);
  } catch (error) {
    console.error('Error listing leads:', error);
    res.status(500).json({ error: 'Failed to list leads' });
  }
};

export const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await getLeadById(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({ error: 'Failed to get lead' });
  }
};

export const addLead = async (req, res) => {
  try {
    const { companyId, name, phone, address, status } = req.body;

    if (!companyId || !name || !phone) {
      return res.status(400).json({ error: 'Company ID, name, and phone are required' });
    }

    const lead = await createLead(companyId, name, phone, address || null, status || 'new');
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

export const editLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, status } = req.body;

    const lead = await updateLead(id, { name, phone, address, status });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

export const removeLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await deleteLead(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};
