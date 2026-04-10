import React, { createContext, useState, useContext } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const selectCompany = (company) => {
    setSelectedCompany(company);
  };

  const clearCompany = () => {
    setSelectedCompany(null);
  };

  return (
    <CompanyContext.Provider value={{ selectedCompany, selectCompany, clearCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};
