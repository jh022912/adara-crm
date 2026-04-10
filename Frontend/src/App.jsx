import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { CompanyLeadsPage } from './pages/CompanyLeadsPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { CompanyProvider } from './context/CompanyContext.jsx';

function App() {
  return (
    <Router>
      <CompanyProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:companyId"
            element={
              <ProtectedRoute>
                <CompanyLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </CompanyProvider>
    </Router>
  );
}

export default App;
