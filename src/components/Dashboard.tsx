import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  User,

} from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';
import { useCurrency } from '../context/CurrencyContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux-store';

export default function Dashboard() {
  const { invoices } = useApp();

  const stats = useMemo(() => {
    const totalRevenue = invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    const pendingPayments = invoices.filter(invoice => invoice.status === 'pending').length;
    const totalInvoices = invoices.length;
    
    const currentDate = new Date();
    const overdue = invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const daysDiff = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 15 && invoice.status !== 'paid';
    }).length;

    return { totalRevenue, pendingPayments, totalInvoices, overdue };
  }, [invoices]);

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 10);
  }, [invoices]);

  const overdueInvoices = useMemo(() => {
    const currentDate = new Date();
    return invoices
      .filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        const daysDiff = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 15 && invoice.status !== 'paid';
      })
      .slice(0, 10);
  }, [invoices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  

  





  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md 
        transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>From paid invoices</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Awaiting payment</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <FileText className="w-4 h-4 mr-1" />
            <span>All invoices created</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>15+ days overdue</span>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <p className="text-sm text-gray-500">Latest invoice activity</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customerName}</p>
                      <p className="text-sm text-gray-500">{invoice.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Overdue Invoices</h3>
            <p className="text-sm text-gray-500">Invoices requiring attention</p>
          </div>
          <div className="p-6">
            {overdueInvoices.length > 0 ? (
              <div className="space-y-4">
                {overdueInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.customerName}</p>
                        <p className="text-sm text-gray-500">Due: {formatDate(invoice.dueDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                      <p className="text-sm text-red-600">Overdue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-500">No overdue invoices</p>
                <p className="text-sm text-gray-400">Great job keeping up with payments!</p>
              </div>
            )}
          </div>
        </div>
      </div>


      


    </div>
  );
}