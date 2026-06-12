import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const MOCK_TX = [
  { id: 1, date: '2026-06-07T00:00:00.000Z', terkumpul: 850000, konsumsi: 0, notes: 'Hari pertama' },
];

const useStore = create((set, get) => ({
  transactions: [],
  budgetItems:  [],
  members:      [],
  targetDana:   12790000,
  isLoading:    false,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const [txRes, bgRes, mbRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/budgets`),
        axios.get(`${API_URL}/members`),
      ]);
      const sorted = txRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      set({ transactions: sorted, budgetItems: bgRes.data, members: mbRes.data });
    } catch {
      set({ transactions: MOCK_TX });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    const res = await axios.post(`${API_URL}/transactions`, data, authHeader());
    const sorted = [...get().transactions, res.data]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    set({ transactions: sorted });
  },

  deleteTransaction: async (id) => {
    await axios.delete(`${API_URL}/transactions/${id}`, authHeader());
    set({ transactions: get().transactions.filter(t => t.id !== id) });
  },

  addBudgetItem: async (data) => {
    const res = await axios.post(`${API_URL}/budgets`, data, authHeader());
    set({ budgetItems: [...get().budgetItems, res.data] });
  },

  deleteBudgetItem: async (id) => {
    await axios.delete(`${API_URL}/budgets/${id}`, authHeader());
    set({ budgetItems: get().budgetItems.filter(b => b.id !== id) });
  },

  addMember: async (data) => {
    const res = await axios.post(`${API_URL}/members`, data, authHeader());
    set({ members: [...get().members, res.data] });
  },

  deleteMember: async (id) => {
    await axios.delete(`${API_URL}/members/${id}`, authHeader());
    set({ members: get().members.filter(m => m.id !== id) });
  },

  setTargetDana: (val) => set({ targetDana: val }),
}));

export default useStore;
