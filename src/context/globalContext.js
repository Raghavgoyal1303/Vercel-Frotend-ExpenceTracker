import React, { useContext, useState } from "react";
import axios from "axios";

// React automatically loads env vars prefixed with REACT_APP_
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create the global context
const GlobalContext = React.createContext();

// Provider component
export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Add Income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err?.response?.data?.message || "Error adding income");
        }
    };

    // Get Incomes
    const getIncomes = async () => {
        try {
            const res = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(res.data);
        } catch (err) {
            setError("Failed to fetch incomes");
        }
    };

    // Delete Income
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError("Failed to delete income");
        }
    };

    // Add Expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err?.response?.data?.message || "Error adding expense");
        }
    };

    // Get Expenses
    const getExpenses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(res.data);
        } catch (err) {
            setError("Failed to fetch expenses");
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError("Failed to delete expense");
        }
    };

    // Total Income
    const totalIncome = () => {
        return incomes.reduce((acc, curr) => acc + curr.amount, 0);
    };

    // Total Expenses
    const totalExpenses = () => {
        return expenses.reduce((acc, curr) => acc + curr.amount, 0);
    };

    // Balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Transaction History (last 3, sorted)
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                expenses,
                totalIncome,
                addExpense,
                getExpenses,
                deleteExpense,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
