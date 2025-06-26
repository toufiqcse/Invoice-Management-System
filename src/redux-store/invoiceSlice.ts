import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Item {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount?: number;
  amount: number;
}

interface Invoice {
  id: string;
  clientName: string;
  items: Item[];
  currency: string;
}

interface State {
  invoices: Invoice[];
}

const initialState: State = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    addInvoice(state, action: PayloadAction<Omit<Invoice, 'id'>>) {
      state.invoices.push({ id: uuidv4(), ...action.payload });
    },
    updateInvoice(state, action: PayloadAction<Invoice>) {
      const index = state.invoices.findIndex(i => i.id === action.payload.id);
      if (index > -1) state.invoices[index] = action.payload;
    },
    deleteInvoice(state, action: PayloadAction<string>) {
      state.invoices = state.invoices.filter(i => i.id !== action.payload);
    }
  }
});

export const { addInvoice, updateInvoice, deleteInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
