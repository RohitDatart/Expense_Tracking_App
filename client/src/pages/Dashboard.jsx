import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AddTransaction from "../components/AddTransaction";
import EditTransaction from "../components/EditTransaction";

const COLORS = ["#4CAF50", "#F44336"]; // Green for income, Red for expense

export default function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get(`/allTransactions/${user._id}`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await axiosInstance.delete(`/deleteTransaction/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  };

  const handleAdd = async (newTxn) => {
    try {
      const res = await axiosInstance.post(`/addTransaction/${user._id}`, newTxn);
      setTransactions([res.data.transaction, ...transactions]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  };

  const handleUpdate = async (updatedTxn) => {
    try {
      const res = await axiosInstance.put(
        `/updateTransaction/${selectedTransaction._id}`,
        updatedTxn
      );
      const updatedList = transactions.map((t) =>
        t._id === selectedTransaction._id ? res.data.transaction : t
      );
      setTransactions(updatedList);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update transaction");
    }
  };

  // Compute summary
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const summaryData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.name || "User"} 👋
        </h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Summary + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <p className="text-green-600 font-bold">Income: ₹{income}</p>
          <p className="text-red-500 font-bold">Expense: ₹{expense}</p>
          <p className="text-gray-700 font-semibold mt-2">
            Balance: ₹{income - expense}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={summaryData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {summaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            + Add Transaction
          </button>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Title</th>
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{t.title}</td>
                  <td
                    className={`py-2 font-semibold ${
                      t.type === "income" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="py-2">₹{t.amount}</td>
                  <td className="py-2">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTransaction(t);
                        setShowEditModal(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTransaction
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}
      {showEditModal && (
        <EditTransaction
          transaction={selectedTransaction}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
