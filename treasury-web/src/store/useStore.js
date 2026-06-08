import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const useStore = create((set) => ({
  members: [],
  transactions: [],
  budgetItems: [],
  targetDana: 15000000,
  
  setMembers: (members) => set({ members }),
  setTransactions: (transactions) => set({ transactions }),
  setBudgetItems: (budgetItems) => set({ budgetItems }),
  
  fetchDashboardData: async () => {
    try {
      const [membersRes, transactionsRes, budgetItemsRes] = await Promise.all([
        axios.get(`${API_URL}/members`),
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/budgets`)
      ]);
      set({
        members: membersRes.data,
        transactions: transactionsRes.data,
        budgetItems: budgetItemsRes.data
      });
    } catch (error) {
      console.warn("Backend unavailable, using mock data for dashboard");
      set({
        members: [
          { id: 1, name: 'Budi', role: 'Ketua', avatarColor: 'bg-red-500' },
          { id: 2, name: 'Siti', role: 'Bendahara', avatarColor: 'bg-blue-500' }
        ],
        transactions: [
          { id: 1, date: '2023-08-01', terkumpul: 1000000, konsumsi: 50000 },
          { id: 2, date: '2023-08-02', terkumpul: 1500000, konsumsi: 0 }
        ],
        budgetItems: [
          { id: 1, name: 'Panggung', category: 'Dekorasi', price: 5000000 }
        ]
      });
    }
  }
}));

export default useStore;
