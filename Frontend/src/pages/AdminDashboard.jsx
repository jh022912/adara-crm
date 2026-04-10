import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies, createCompany } from '../api/companyService.js';
import { logout } from '../api/authService.js';
import { useCompany } from '../context/CompanyContext.jsx';

export const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { selectCompany } = useCompany();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err.error || 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSelectCompany = (company) => {
    selectCompany(company);
    navigate(`/company/${company.id}`);
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setCreating(true);
    try {
      const company = await createCompany(newCompanyName.trim());
      setCompanies([...companies, company]);
      setShowModal(false);
      setNewCompanyName('');
    } catch (err) {
      setError(err.error || 'Failed to create company');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-lightGray">
      <nav className="bg-darkNavy text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Adara CRM</h1>
          <button
            onClick={handleLogout}
            className="bg-navy hover:bg-darkNavy px-4 py-2 rounded font-serif transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-darkNavy mb-2">
            Welcome, Admin
          </h2>
          <p className="text-gray-600 font-serif">
            Select a company to manage its leads
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded font-serif mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-serif text-lg">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 font-serif text-lg mb-4">
              No companies found. Create one to get started.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-darkNavy hover:bg-navy text-white px-6 py-3 rounded font-serif transition duration-200"
            >
              Create Company
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 cursor-pointer transition duration-200 border border-gray-200 hover:border-navy"
              >
                <h3 className="text-xl font-serif font-bold text-darkNavy mb-2">
                  {company.name}
                </h3>
                <p className="text-gray-600 font-serif text-sm mb-4">
                  Click to view and manage leads
                </p>
                <div className="flex items-center justify-end text-navy font-serif font-semibold">
                  View Leads →
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-serif font-bold text-darkNavy mb-6">Create Company</h3>
            <form onSubmit={handleCreateCompany}>
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Company name"
                className="w-full border border-gray-300 rounded px-4 py-3 font-serif mb-4 focus:outline-none focus:border-navy"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-darkNavy hover:bg-navy text-white px-4 py-3 rounded font-serif transition duration-200 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setNewCompanyName(''); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-darkNavy px-4 py-3 rounded font-serif transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
