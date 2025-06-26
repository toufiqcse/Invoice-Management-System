import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  User, 
  Mail, 
  Phone, 
  Calendar
} from 'lucide-react';
import { InvoiceItem } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { currencyOptions, getCurrencySymbol } from '../utils/currency';




interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export default function NewInvoiceModal({ isOpen, onClose }: NewInvoiceModalProps) {
  const { addInvoice, showToast, company } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    dueDate: '',
    status: 'pending' as const
  });

  

const {currency, setCurrency} =  useCurrency()
console.log(currency);


  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, discount: 0, amount: 0 }
  ]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate' || field === 'discount') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate - updatedItem.discount;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const invoice = {
      ...formData,
      amount: totalAmount,
      createdDate: new Date().toISOString().split('T')[0],
      items: items.filter(item => item.description.trim() !== '')
    };

    addInvoice(invoice);
    showToast('Invoice created successfully', 'success');
    handleClose();
    setIsLoading(false);
  };

  const handlePrint = async () => {
    if (totalAmount === 0 || !formData.customerName) {
      showToast('Please fill in customer details and add items before printing', 'warning');
      return;
    }

    setIsPrinting(true);
    
    // Simulate print processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a temporary invoice for printing
    const tempInvoice = {
      id: `TEMP-${Date.now()}`,
      ...formData,
      amount: totalAmount,
      createdDate: new Date().toISOString().split('T')[0],
      items: items.filter(item => item.description.trim() !== '')
    };

    // Generate print content
    const printContent = generatePrintContent(tempInvoice);
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }

    setIsPrinting(false);
    showToast('Invoice sent to printer', 'success');
  };

  const generatePrintContent = (invoice: any) => {
    const subtotal = invoice.items.reduce((sum: number, item: any) => sum + item.amount, 0);
    const total = subtotal;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 30px; 
            }
            .company-info { 
            text-align: right; 
            }
            .invoice-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
            }
            .customer-info { 
            margin-bottom: 30px; 
            display: flex;
            flex-direction: row;
            }
            table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
            }
            th, td { padding: 
            10px; text-align: left; 
            border-bottom: 1px solid #ddd; 
            }
            th { 
            background-color: #f5f5f5; 
            }
            .totals { 
            text-align: right; 
            margin-top: 20px; 
            }
            .total-row { 
            font-weight: bold; 
            font-size: 18px; 
            }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div>Invoice #: ${invoice.id}</div>
              <div>Date: ${new Date(invoice.createdDate).toLocaleDateString()}</div>
            </div>
            <div class="company-info">
              <div style="font-weight: bold; font-size: 18px;">${company.name}</div>
              <div>${company.address}</div>
              <div>${company.phone}</div>
              <div>${company.website}</div>
            </div>
          </div>
          
          <div class="customer-info">
            <strong>Bill To:</strong><br>
            ${invoice.customerName}<br>
            ${invoice.customerEmail}<br>
            ${invoice.customerPhone}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.rate.toFixed(2)}</td>
                  td>${item.description}</td>
                  <td>$${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div>Subtotal: $${subtotal.toFixed(2)}</div>
           
            <div class="total-row">Total: $${total.toFixed(2)}</div>
          </div>
          
          <div style="margin-top: 40px; font-size: 12px; color: #666;">
            Thank you for your business! Payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.
          </div>
        </body>
      </html>
    `;
  };

  const handleClose = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      dueDate: '',
      status: 'pending'
    });
    setItems([{ id: '1', description: '', quantity: 1, rate: 0, discount: 0, amount: 0 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Invoice</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
             
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Invoice Items</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 bg-slate-200 px-2 py-2 rounded-md"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-12 md:col-span-5">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Rate
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Discount */}
                      <div className="col-span-4 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Discount
                        </label>
                        <input
                       type="number"
                       name="discount"
                       value={item.discount}
                       onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value))}
                          placeholder="Discount"
                              className="w-full border p-2 rounded"
                        />
                      </div>
                       {/* amount */}
                       <div className="col-span-4 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
                          {getCurrencySymbol(currency)} {item.amount.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>                    
                  ))}


                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-900">
                    {getCurrencySymbol(currency)}
                    {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className='flex justify-between items-center gap-x-7'>
                  {/* Currency set */}
              <div className="space-y-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"> Select Currency</label>
                  
                  <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
    >
                    {currencyOptions.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                       {opt.label}
                      </option>
                   ))}
                  </select>
                </div>
              </div>

              {/* Payment Status */}
              <div className='w-full'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              </div>


            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Invoice
                </div>
              )}
            </button>
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPrinting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Printing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </div>
              )}
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}