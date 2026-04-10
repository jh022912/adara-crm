import React, { useState } from 'react';
import { deleteLead, updateLead } from '../api/leadService.js';
import { LeadModal } from './LeadModal.jsx';

export const LeadTable = ({ leads, companyId, onLeadsChange }) => {
  const [editingLead, setEditingLead] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (lead, newStatus) => {
    setUpdating(lead.id);
    try {
      await updateLead(lead.id, { ...lead, status: newStatus });
      onLeadsChange();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      onLeadsChange();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const statusOptions = ['new', 'attempted', 'contacted', 'sold'];
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    attempted: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-purple-100 text-purple-800',
    sold: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-darkNavy text-white">
            <tr>
              <th className="px-6 py-4 text-left font-serif font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-serif font-semibold">Phone</th>
              <th className="px-6 py-4 text-left font-serif font-semibold">Address</th>
              <th className="px-6 py-4 text-left font-serif font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-serif font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-600 font-serif">
                  No leads found. Add one to get started.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-200 hover:bg-lightGray">
                  <td className="px-6 py-4 font-serif text-darkNavy font-semibold">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 font-serif text-gray-700">{lead.phone}</td>
                  <td className="px-6 py-4 font-serif text-gray-700">
                    {lead.address || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead, e.target.value)}
                      disabled={updating === lead.id}
                      className={`px-3 py-1 rounded font-serif font-semibold cursor-pointer ${
                        statusColors[lead.status]
                      } disabled:opacity-50`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="text-navy hover:text-darkNavy font-serif font-semibold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(lead.id)}
                      className="text-red-600 hover:text-red-800 font-serif font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingLead && (
        <LeadModal
          companyId={companyId}
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onLeadAdded={onLeadsChange}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-xl font-serif font-bold text-darkNavy mb-4">
              Delete Lead
            </h3>
            <p className="text-gray-600 font-serif mb-6">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded font-serif text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-serif transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
