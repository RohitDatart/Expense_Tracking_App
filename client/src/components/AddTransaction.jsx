import { useState, useEffect } from "react";

export default function AddTransaction({ onClose, onSave, transactions = [] }) {
  const [form, setForm] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
    title: "",
    notes: "",
  });

  // Default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm(prev => ({ ...prev, date: today }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For amount: only allow numbers and decimal point
    if (name === "amount") {
      // Filter to allow only numbers, decimal, and prevent multiple decimals
      const numericValue = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\./g, "$1");
      setForm(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!form.amount || parseFloat(form.amount) <= 0 || !form.title.trim()) {
      return alert("Please fill in a valid amount and description.");
    }
    // Prepare data for backend
    const submitData = {
      ...form,
      amount: parseFloat(form.amount),
      title: form.title.trim(),
      notes: form.notes.trim() || undefined,
    };
    onSave(submitData);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Expense</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="addDate" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="addDate"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="addType" className="form-label">Type</label>
                  <select
                    className="form-select"
                    id="addType"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                     <option value="">Select</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="addTitle" className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="addTitle"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="addCategory" className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    id="addCategory"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Enter category "
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="addAmount" className="form-label">Amount</label>
                  <input
                    type="text" // Use text for full control over input
                    className="form-control"
                    id="addAmount"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    inputMode="decimal" // Numeric keyboard on mobile
                    pattern="[0-9]*[.,]?[0-9]*"
                    // Hide spinner arrows in number inputs
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
                  <label htmlFor="addNotes" className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    id="addNotes"
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any notes..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!form.title || !form.amount || parseFloat(form.amount) <= 0}
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}