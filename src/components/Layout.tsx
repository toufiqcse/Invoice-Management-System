import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onNewInvoice: () => void;
}

export default function Layout({ children, currentPage, onPageChange, onNewInvoice }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user, showToast } = useApp();

  // Navigation page
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { name: 'Invoices', icon: FileText, key: 'invoices' },
    { name: 'Settings', icon: Settings, key: 'settings' },
  ];

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <img 
                  src="https://i.ibb.co/ns2fp8Dh/Web-Frik-Hero-Logo-with-light-bg-with-main-logo.png" 
                  alt="Web Frik" 
                  className="h-8 w-auto"
                />
                <div className="ml-3">
                  
                  <p className="text-xs text-gray-500"> Invoice Management</p>
                </div>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onPageChange(item.key);
                        setSidebarOpen(false);
                      }}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                        currentPage === item.key
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex  items-center flex-shrink-0 px-4">
              <img 
                src="https://i.ibb.co/ns2fp8Dh/Web-Frik-Hero-Logo-with-light-bg-with-main-logo.png" 
                alt="Web Frik" 
                className="h-8 w-auto"
              />
       
            </div>

            {/* Navigation  list*/}
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => onPageChange(item.key)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors duration-200 ${
                      currentPage === item.key
                        ? 'bg-blue-300 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-60 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {currentPage}
                  </h1>
                  <p className="text-gray-600">
                    {currentPage === 'dashboard' && 'Invoice Management System'}
                    {currentPage === 'invoices' && 'Manage all your invoices'}
                    {currentPage === 'settings' && 'Configure your company settings'}
                  </p>
                </div>

                
                
                {currentPage !== 'settings' && (
                  <button
                    onClick={onNewInvoice}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    New Invoice 
                  </button>
                )}
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}