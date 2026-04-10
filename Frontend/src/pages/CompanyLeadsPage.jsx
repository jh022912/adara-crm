import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeads, syncLeads } from '../api/leadService.js';
import { getCompany } from '../api/companyService.js';
import { LeadTable } from '../components/LeadTable.jsx';
import { LeadModal } from '../components/LeadModal.jsx';
import { useCompany } from '../context/CompanyContext.jsx';

export const CompanyLeadsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();

  const [company, setCompany] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyData, leadsData] = await Promise.all([
          getCompany(companyId),
          getLeads(companyId),
        ]);
        setCompany(companyData);
        setLeads(leadsData);
      } catch (err) {
        setError(err.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await syncLeads();
      const updated = await getLeads(companyId);
      setLeads(updated);
    } catch (err) {
      setError(err.error || 'Sync failed');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleLeadAdded = async () => {
    const updated = await getLeads(companyId);
    setLeads(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-serif text-lg">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightGray">
      <nav className="bg-darkNavy text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold">Adara CRM</h1>
            {company && (
              <p className="text-gray-300 font-serif text-sm mt-1">
                {company.name}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-navy hover:bg-darkNavy px-4 py-2 rounded font-serif transition duration-200"
          >
            Back to Companies
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded font-serif mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-darkNavy">
              Leads & Customers
            </h2>
            <p className="text-gray-600 font-serif mt-1">
              Total leads: {leads.length}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSync}
              disabled={syncLoading}
              className="bg-navy hover:bg-darkNavy text-white px-6 py-3 rounded font-serif transition duration-200 disabled:opacity-50"
            >
              {syncLoading ? 'Syncing...' : 'Sync from Sheets'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-darkNavy hover:bg-navy text-white px-6 py-3 rounded font-serif transition duration-200"
            >
              Add Lead
            </button>
          </div>
        </div>

        <LeadTable leads={leads} companyId={companyId} onLeadsChange={handleLeadAdded} />
      </main>

      {showModal && (
        <LeadModal
          companyId={companyId}
          onClose={() => setShowModal(false)}
          onLeadAdded={handleLeadAdded}
        />
      )}
    </div>
  );
};
