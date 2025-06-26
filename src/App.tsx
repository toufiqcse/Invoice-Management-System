import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Settings from './components/Settings';
import NewInvoiceModal from './components/NewInvoiceModal';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const { user } = useApp();

  if (!user) {
    return <Login />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onNewInvoice={() => setShowNewInvoiceModal(true)}
      >
        {renderCurrentPage()}
      </Layout>
      
      <NewInvoiceModal
        isOpen={showNewInvoiceModal}
        onClose={() => setShowNewInvoiceModal(false)}
      />
    </>
  );
}


function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;