import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import AddTransaction from "../../components/AddTransaction"; // Your separate component
import { FaCircleUser } from "react-icons/fa6";

const PIE_COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("By Category");
  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowProfileModal(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchTransactions = async () => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.get(`/allTransactions/${user._id}`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load transactions");
    }
  };

  const fetchGraphData = async () => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.get(`/getTransactionGraphData/${user._id}`);
      if (res.data?.success) {
        setGraphData(res.data.data.barChart || []);
        setCategoryData(
          Object.entries(res.data.data.pieChart || {}).map(([name, value]) => ({ name, value: Number(value) }))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load graph data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchGraphData();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...transactions];
    if (startDate) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(endDate));
    }
    if (selectedType !== "All Types") {
      filtered = filtered.filter((t) => t.type === selectedType.toLowerCase());
    }
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }
    setFilteredTransactions(filtered);
  }, [transactions, startDate, endDate, selectedType, selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/deleteTransaction/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
      fetchGraphData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const handleAdd = async (newTxn) => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.post(`/addTransaction/${user._id}`, newTxn);
      setTransactions([res.data.transaction, ...transactions]);
      setShowAddModal(false);
      fetchGraphData();
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  };

  const handleUpdate = async (updatedTxn) => {
    if (!selectedTransaction?._id) return;
    try {
      const res = await axiosInstance.put(`/updateTransaction/${selectedTransaction._id}`, updatedTxn);
      const updatedList = transactions.map((t) => t._id === selectedTransaction._id ? res.data.transaction : t);
      setTransactions(updatedList);
      setShowEditModal(false);
      fetchGraphData();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const openEditModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  // ProfileModal (unchanged)
  const ProfileModal = ({ user, onClose }) => (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <FaCircleUser size={30} />&nbsp;&nbsp;<h5 className="modal-title">Profile Info</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <div className="d-flex mb-3 gap-3"><strong>Username:</strong> <span>{user.user_name}</span></div>
            <div className="d-flex mb-3 gap-3"><strong>Mobile No:</strong> {user.phone_number}</div>
            <div className="d-flex mb-3 gap-3"><strong>Email:</strong> {user.email}</div>
            <div className="d-flex mb-3 gap-3"><strong>Remaining Balance:</strong> <span className="text-success h5">₹{user.reaming_balance?.toLocaleString()}</span></div> {/* Fixed field name */}
          </div>
          <div className="modal-footer border-0 justify-content-end">
            <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ViewTransaction (unchanged, but fixed field)
  const ViewTransaction = ({ transaction, onClose }) => (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Expense Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString('en-GB')}</p>
                <p><strong>Description:</strong> {transaction.title}</p>
                <p><strong>Category:</strong> {transaction.category || "Uncategorized"}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Type:</strong> <span className="">{transaction.type}</span></p>
                <p><strong>Amount:</strong> <span className={transaction.type === "income" ? "text-success h4" : "text-danger h4"}>{transaction.type === "income" ? `+₹${transaction.amount.toLocaleString()}` : `-₹${transaction.amount.toLocaleString()}`}</span></p>
                {transaction.notes && <p><strong>Notes:</strong> {transaction.notes}</p>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          
          </div>
        </div>
      </div>
    </div>
  );

  // EditTransaction (inline, updated for title/notes consistency)
  const EditTransaction = ({ transaction, onClose, onSave, transactions }) => {
    const [formData, setFormData] = useState({
      date: new Date(transaction.date).toISOString().split('T')[0],
      title: transaction.title || '',
      category: transaction.category || '',
      type: transaction.type || 'expense',
      amount: transaction.amount || 0,
      notes: transaction.notes || '',
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        title: formData.title.trim(),
        notes: formData.notes.trim() || undefined,
      };
      onSave(submitData);
    };

    const uniqueCategories = [...new Set(transactions.map((t) => t.category).filter(Boolean))];

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Transaction</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Type</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter description" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category manually"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Amount</label>
                  <input
                    type="text" // Use text for full control
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    inputMode="decimal" // Numeric keyboard on mobile
                    pattern="[0-9]*[.,]?[0-9]*"
                    // Hide spinner arrows and prevent scroll changes
                    style={{
                      MozAppearance: 'textfield',
                      WebkitAppearance: 'textfield',
                      appearance: 'textfield'
                    }}
                    onWheel={(e) => e.target.blur()} // Blur on scroll to prevent changes
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea className="form-control" name="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="Add any notes..." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  };

  // Summary calculations (fixed balance field)
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);

  useEffect(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const balance = income - expense;
    const rate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;
    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(balance);
    setSavingsRate(rate);
  }, [transactions]);

  const uniqueCategories = [...new Set(transactions.map((t) => t.category).filter(Boolean))];

  if (!user) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  return (
    <div className="container-fluid min-vh-100 py-4 bg-light">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px", cursor: "pointer" }} onClick={() => setShowProfileModal(true)}>
              <span className="fs-4 fw-bold">₹</span>
            </div>
            <div>
              <h1 className="h3 mb-1 text-dark">Expense Dashboard</h1>
              <p className="mb-0 text-muted small">Welcome, {user.user_name || "User"} 👋</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-md-end">
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary me-2">+ Add Expense</button>
          <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title text-muted mb-1">Total Balance</h6>
                <h3 className="text-primary mb-1">₹{totalBalance.toLocaleString()}</h3>
                <small className="text-muted">Current balance</small>
              </div>
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}><span className="text-muted">💰</span></div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title text-muted mb-1">Total Income</h6>
                <h3 className="text-success mb-1">₹{totalIncome.toLocaleString()}</h3>
                <small className="text-muted">All time</small>
              </div>
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}><span className="text-success">📈</span></div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title text-muted mb-1">Total Expenses</h6>
                <h3 className="text-danger mb-1">₹{totalExpense.toLocaleString()}</h3>
                <small className="text-muted">All time</small>
              </div>
              <div className="bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}><span className="text-danger">📉</span></div>
            </div>
          </div>
        </div>
       
      </div>

      {/* Spending Analytics (unchanged) */}
      <div className="card border-0 shadow-sm mb-5">
  <div className="card-body">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 className="card-title mb-1">Spending Analytics</h5>
      </div>
    </div>
    {/* Side-by-side charts in col-6 layout */}
    <div className="row ">
      {/* By Category Chart */}
      <div className="col-md-6   d-flex flex-column">
        <h5 className="text-center fw-bold mb-3">By Category</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={categoryData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={100} 
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Monthly Trend Chart */}
      <div className=" col-md-6 d-flex flex-column">
        <h5 className="text-center fw-bold mb-3">Monthly Trend</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#4CAF50" name="Income" />
            <Bar dataKey="expense" fill="#F44336" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>

      {/* Transaction History (updated for title field) */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Expense History</h5>
          <div className="row align-items-end mb-4 g-3">
            <div className="col-md-3">
              <label  className="form-label small text-muted">Start Date</label>
              <input type="date" className="form-control " value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">End Date</label>
              <input type="date" className="form-control " value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Types</label>
              <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option>All Types</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Categories</label>
              <select className="form-select " value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option>All Categories</option>
                {uniqueCategories.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          {filteredTransactions.length === 0 ? (
            <p className="text-muted text-center py-4">No transactions found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th className="text-center">Actions</th></tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString('en-GB')}</td>
                      <td>{t.title}</td>
                      <td>{t.category || "Uncategorized"}</td>
                      <td><span className={`badge ${t.type === "income" ? "bg-success" : "bg-danger"}`}>{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span></td>
                      <td><span className={t.type === "income" ? "text-success fw-semibold" : "text-danger fw-semibold"}>{t.type === "income" ? `₹${t.amount.toLocaleString()}` : `₹${t.amount.toLocaleString()}`}</span></td>
                      <td className="text-center">
                        <button onClick={() => handleView(t)} className="btn btn-sm btn-outline-primary me-1">View</button>
                        <button onClick={() => openEditModal(t)} className="btn btn-sm btn-outline-primary me-1">Edit</button>
                        <button onClick={() => handleDelete(t._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && user && <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />}
      {showViewModal && selectedTransaction && <ViewTransaction transaction={selectedTransaction} onClose={() => setShowViewModal(false)} />}
      {showEditModal && selectedTransaction && <EditTransaction transaction={selectedTransaction} onClose={() => setShowEditModal(false)} onSave={handleUpdate} transactions={transactions} />}
      {showAddModal && <AddTransaction onClose={() => setShowAddModal(false)} onSave={handleAdd} transactions={transactions} />}
    </div>
  );
}