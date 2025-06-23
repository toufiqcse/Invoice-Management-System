export interface Company {
  name: string;
  address: string;
  phone: string;
  website: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdDate: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface User {
  id: string;
  username: string;
}

export interface AppState {
  user: User | null;
  company: Company;
  invoices: Invoice[];
  isLoading: boolean;
}

export interface AppContextType extends AppState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateCompany: (company: Company) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}