import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, User, Phone, Mail, Calendar } from 'lucide-react';
import { Invoice } from '../types';
import {getCurrencySymbol} from '../utils/currency'
import { useCurrency } from '../context/CurrencyContext';



interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export default function ViewInvoiceModal({ isOpen, onClose, invoice }: ViewInvoiceModalProps) {
  const { company, showToast } = useApp();

  const {currency} = useCurrency()

  if (!isOpen || !invoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
    showToast('Invoice printed successfully', 'success');
  };

  
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  //const tax = subtotal * 0.1; 
  const total = subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
                
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img 
                    src="https://i.ibb.co/ns2fp8Dh/Web-Frik-Hero-Logo-with-light-bg-with-main-logo.png" 
                    alt="Web Frik" 
                    className="h-12 w-auto mr-4"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                    <p className="text-gray-600">#{invoice.id}</p>
                    
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                  <p className="text-gray-600 whitespace-pre-line">{company.address}</p>
                  <p className="text-gray-600">{company.phone}</p>
                  <p className="text-gray-600">{company.website}</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{invoice.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{invoice.customerEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{invoice.customerPhone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Date:</span>
                      <span className="text-gray-900">{formatDate(invoice.createdDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 text-gray-600 font-medium">Description</th>
                      <th className="text-center py-3 text-gray-600 font-medium">Qty</th>
                      <th className="text-right py-3 text-gray-600 font-medium">Rate</th>
                      <th className="text-right py-3 text-gray-600 font-medium">Discount</th>
                      <th className="text-right py-3 text-gray-600 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900">{item.description}</td>
                        <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-600">{getCurrencySymbol(currency)} {(item.rate)}</td>
                        <td className="py-3 text-right text-gray-600">{getCurrencySymbol(currency)} {(item.discount)}</td>
                        <td className="py-3 text-right text-gray-900 font-medium">{getCurrencySymbol(currency)} {(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">{getCurrencySymbol(currency)} {subtotal}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Tax (10%):</span>
                      <span className="text-gray-900">{formatCurrency(tax)}</span>
                    </div> */}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">{getCurrencySymbol(currency)} {total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Thank you for connecting with us! If any queries contact with us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}