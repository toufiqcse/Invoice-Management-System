import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppContextType, AppState, Invoice, Company, User } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: { id: string; updates: Partial<Invoice> } }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  company: {
    name: 'Web Frik',
    address: 'Sadar Joypurhat',
    phone: '+8801750119633',
    website: 'www.webfrik.com'
  },
  invoices: [
    
  ],
  isLoading: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id
            ? { ...invoice, ...action.payload.updates }
            : invoice
        )
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice.id !== action.payload)
      };
    case 'UPDATE_COMPANY':
      return { ...state, company: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (username: string, password: string): boolean => {
    if (username === 'Webfrik' && password === '@1234Web#') {
      dispatch({ type: 'LOGIN', payload: { id: '1', username } });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const invoice: Invoice = {
      ...invoiceData,
      id: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`
    };
    dispatch({ type: 'ADD_INVOICE', payload: invoice });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    dispatch({ type: 'UPDATE_INVOICE', payload: { id, updates } });
  };

  const deleteInvoice = (id: string) => {
    dispatch({ type: 'DELETE_INVOICE', payload: id });
  };

  const updateCompany = (company: Company) => {
    dispatch({ type: 'UPDATE_COMPANY', payload: company });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // Simple toast implementation - in production, you might want to use a proper toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const contextValue: AppContextType = {
    ...state,
    login,
    logout,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    updateCompany,
    showToast
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};