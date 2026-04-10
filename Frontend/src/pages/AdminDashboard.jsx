import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies } from '../api/companyService.js';
import { logout } from '../api/authService.js';
import { useCompany } from '../context/CompanyContext.jsx';

export const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
              onClick={() => navigate('/create-company')}
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
    </div>
  );
};
