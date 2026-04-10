import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService.js';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightGray">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-serif font-bold text-darkNavy text-center mb-2">
          Adara CRM
        </h1>
        <p className="text-center text-gray-600 mb-8 font-serif">
          Lead Management System
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-serif text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-darkNavy font-serif font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded font-serif focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-darkNavy font-serif font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded font-serif focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-darkNavy hover:bg-navy text-white font-serif font-semibold py-3 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 font-serif text-sm mt-6">
          For admin access only
        </p>
      </div>
    </div>
  );
};
