import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

// Create context with default fallback
const defaultContextValue = {
  transactions: [],
  filteredTransactions: [],
  categories: [{ _id: "default", name: "Other", color: "#FFE66D", icon: "❓" }],
  totalIncome: 0,
  totalExpense: 0,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  formData: {
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split('T')[0],
  },
  selectedValue: "expense",
  isLoading: false,
  error: null,
  // Safe function fallbacks
  setTransactions: () => {},
  setCategories: () => {},
  handleFormSubmit: () => ({}),
  addCategory: async () => {},
  editCategory: async () => {},
  deleteCategory: async () => {},
};

export const GlobalContext = createContext(defaultContextValue);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  
  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 useGlobalContext called, context:', context);
  }
  
  // Always return safe values
  return {
    ...defaultContextValue,
    ...context,
    transactions: context.transactions || [],
    filteredTransactions: context.filteredTransactions || [],
    categories: context.categories || defaultContextValue.categories,
    totalIncome: context.totalIncome || 0,
    totalExpense: context.totalExpense || 0,
  };
};

export function GlobalProvider({ children }) {
  console.log('🚀 GlobalProvider mounting...');
  
  // All state with explicit initialization
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedValue, setSelectedValue] = useState("expense");
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState(defaultContextValue.categories);
  const [isLoading, setIsLoading] = useState(true);

  // Safe category fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/categories", {
          timeout: 3000,
        }).catch(() => null); // Don't throw, just fail silently
        
        if (response?.data?.length > 0) {
          setCategories(response.data);
        }
      } catch (error) {
        console.warn("Backend unavailable, using defaults:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safe localStorage operations
  useEffect(() => {
    try {
      const saved = localStorage.getItem("transactions");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTransactions(Array.isArray(parsed) ? parsed : []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  // Safe CRUD operations
  const addCategory = async (name, color, icon) => {
    try {
      // Try backend first
      const response = await axios.post("http://localhost:5000/api/categories", {
        name, color, icon
      }).catch(() => null);
      
      if (response?.data) {
        setCategories(prev => [...prev, response.data]);
        return response.data;
      }
      
      // Fallback to local
      const newCat = { _id: Date.now().toString(), name, color, icon };
      setCategories(prev => [...prev, newCat]);
      return newCat;
    } catch {
      const fallback = { _id: Date.now().toString(), name, color, icon };
      setCategories(prev => [...prev, fallback]);
      return fallback;
    }
  };

  const editCategory = async (id, name, color, icon) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/categories/${id}`, {
        name, color, icon
      }).catch(() => null);
      
      if (response?.data) {
        setCategories(prev => prev.map(cat => cat._id === id ? response.data : cat));
        return response.data;
      }
      
      // Local fallback
      setCategories(prev => prev.map(cat => cat._id === id ? { ...cat, name, color, icon } : cat));
    } catch {
      setCategories(prev => prev.map(cat => cat._id === id ? { ...cat, name, color, icon } : cat));
    }
  };

  const deleteCategory = async (id) => {
    setCategories(prev => prev.filter(cat => cat._id !== id));
  };

  const handleFormSubmit = (data) => {
    const transaction = { ...data, id: Date.now() };
    setTransactions(prev => [...prev, transaction]);
    return transaction;
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!t?.date) return false;
      const date = new Date(t.date);
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  // IMMEDIATELY SAFE VALUE
  const contextValue = {
    transactions,
    filteredTransactions,
    setTransactions,
    handleFormSubmit,
    categories,
    setCategories,
    addCategory,
    editCategory,
    deleteCategory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filteredCategory,
    setFilteredCategory,
    totalIncome,
    totalExpense,
    formData,
    setFormData,
    selectedValue,
    setSelectedValue,
    isLoading,
  };

  console.log('✅ Provider value ready:', {
    txCount: contextValue.transactions.length,
    catCount: contextValue.categories.length
  });

  // CRITICAL: Return context with value IMMEDIATELY
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}