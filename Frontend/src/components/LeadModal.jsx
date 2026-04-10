import React, { useState, useEffect } from 'react';
import { createLead, updateLead } from '../api/leadService.js';

export const LeadModal = ({ companyId, lead, onClose, onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    status: 'new',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        phone: lead.phone,
        address: lead.address || '',
        status: lead.status,
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (lead) {
        await updateLead(lead.id, formData);
      } else {
        await createLead(companyId, formData.name, formData.phone, formData.address, formData.status);
      }
      onLeadAdded();
      onClose();
    } catch (err) {
      setError(err.error || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-serif font-bold text-darkNavy mb-4">
          {lead ? 'Edit Lead' : 'Add New Lead'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-serif text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-darkNavy font-serif font-semibold mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded font-serif focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              placeholder="Customer name"
            />
          </div>

          <div>
            <label className="block text-darkNavy font-serif font-semibold mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded font-serif focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-darkNavy font-serif font-semibold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded font-serif focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              placeholder="Street address"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-darkNavy font-serif font-semibold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded font-serif focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            >
              <option value="new">New</option>
              <option value="attempted">Attempted</option>
              <option value="contacted">Contacted</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded font-serif text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-darkNavy hover:bg-navy text-white rounded font-serif transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
