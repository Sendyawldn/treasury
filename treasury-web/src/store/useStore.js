import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const MOCK_TX = [];

const useStore = create((set, get) => ({
  transactions: [],
  budgetItems: [],
  members: [],
  customRoles: JSON.parse(
    localStorage.getItem("customRoles") ||
      '["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"]',
  ),
  targetDana: 0,
  isLoading: false,

  addCustomRole: (role) => {
    const { customRoles } = get();
    if (!customRoles.includes(role)) {
      const newRoles = [...customRoles, role];
      localStorage.setItem("customRoles", JSON.stringify(newRoles));
      set({ customRoles: newRoles });
    }
  },

  deleteCustomRole: (role) => {
    const newRoles = get().customRoles.filter((r) => r !== role);
    localStorage.setItem("customRoles", JSON.stringify(newRoles));
    set({ customRoles: newRoles });
  },

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const [txRes, bgRes, mbRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/budgets`),
        axios.get(`${API_URL}/members`),
      ]);
      const sortedTx = txRes.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      const sortedBg = bgRes.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      set({
        transactions: sortedTx,
        budgetItems: sortedBg,
        members: mbRes.data,
      });
    } catch {
      set({ transactions: MOCK_TX });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    try {
      const res = await axios.post(
        `${API_URL}/transactions`,
        data,
        authHeader(),
      );
      const sorted = [...get().transactions, res.data].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      set({ transactions: sorted });
    } catch {
      const mockData = { ...data, id: Date.now() };
      const sorted = [...get().transactions, mockData].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      set({ transactions: sorted });
    }
  },

  deleteTransaction: async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, authHeader());
    } catch {
      // Ignore error for mock fallback
    } finally {
      set({ transactions: get().transactions.filter((t) => t.id !== id) });
    }
  },

  editTransaction: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/transactions/${id}`, data, authHeader());
      set({
        transactions: get().transactions.map(t => t.id === id ? res.data : t).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      });
    } catch {
      set({
        transactions: get().transactions.map(t => t.id === id ? { ...t, ...data } : t).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      });
    }
  },

  addBudgetItem: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/budgets`, data, authHeader());
      const sortedBg = [...get().budgetItems, res.data].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      set({ budgetItems: sortedBg });
    } catch {
      const mockData = { ...data, id: Date.now() };
      const sortedBg = [...get().budgetItems, mockData].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      set({ budgetItems: sortedBg });
    }
  },

  editBudgetItem: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/budgets/${id}`, data, authHeader());
      const sortedBg = get().budgetItems.map(b => b.id === id ? res.data : b).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      set({ budgetItems: sortedBg });
    } catch {
      const sortedBg = get().budgetItems.map(b => b.id === id ? { ...b, ...data } : b).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      set({ budgetItems: sortedBg });
    }
  },

  deleteBudgetItem: async (id) => {
    try {
      await axios.delete(`${API_URL}/budgets/${id}`, authHeader());
    } catch {
      // Ignore error for mock fallback
    } finally {
      set({ budgetItems: get().budgetItems.filter((b) => b.id !== id) });
    }
  },

  addMember: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/members`, data, authHeader());
      set({ members: [...get().members, res.data] });
    } catch {
      set({ members: [...get().members, { ...data, id: Date.now() }] });
    }
  },

  deleteMember: async (id) => {
    try {
      await axios.delete(`${API_URL}/members/${id}`, authHeader());
    } catch {
      // Ignore error for mock fallback
    } finally {
      set({ members: get().members.filter((m) => m.id !== id) });
    }
  },

  setTargetDana: (val) => set({ targetDana: val }),
}));

export default useStore;
