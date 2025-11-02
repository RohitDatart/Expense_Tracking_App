const User = require("../models/user_model");
const Transaction = require("../models/trancation_model");
const mongoose = require("mongoose");

const addTransaction = async (req, res) => {
  try {
    const userId = req.params.userId; // assuming you pass userId in URL
    const { type, title, amount, description, category, date } = req.body;

    // Find user
    const user = await User.findOne(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Validate expense balance
    if (type === "expense" && user.reaming_balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Create transaction in Transaction collection
    const transaction = await Transaction.create({
      user: user._id,
      type,
      title,
      amount,
      description,
      category,
      date,
    });

    // Update user's transaction array
    user.transactions.push(transaction._id);

    // Update user's remaining balance
    if (type === "income") {
      user.reaming_balance += amount;
    } else if (type === "expense") {
      user.reaming_balance -= amount;
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
      balance: user.reaming_balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.params.userId; // set by protect middleware

    const { type, category, startDate, endDate } = req.query;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Build filter object
    const filter = { user: user._id };
    if (type) filter.type = type.toLowerCase();
    if (category) filter.category = category;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch transactions
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // Calculate totals for summary
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);


    res.status(200).json({
      success: true,
      count: transactions.length,
      summary: {
        totalIncome,
        totalExpense,
        balance: user.reaming_balance,
      },
      transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSingleTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, message: "Invalid transaction ID" });
    }

    // Find transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { type, title, amount, category, description, date } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Find user to adjust balance
    const user = await User.findById(transaction.user);

    // Revert previous balance
    if (transaction.type === "income") user.reaming_balance -= transaction.amount;
    if (transaction.type === "expense") user.reaming_balance += transaction.amount;

    // Update transaction fields
    transaction.type = type || transaction.type;
    transaction.title = title || transaction.title;
    transaction.amount = amount !== undefined ? amount : transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;

    await transaction.save();

    // Apply new balance
    if (transaction.type === "income") user.reaming_balance += transaction.amount;
    if (transaction.type === "expense") user.reaming_balance -= transaction.amount;

    await user.save();

    res.status(200).json({ success: true, message: "Transaction updated", transaction, balance: user.reaming_balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, message: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const user = await User.findById(transaction.user);

    // Adjust balance
    if (transaction.type === "income") user.reaming_balance -= transaction.amount;
    if (transaction.type === "expense") user.reaming_balance += transaction.amount;

    // Remove transaction from user's transaction array
    user.transactions.pull(transaction._id);
    await user.save();

    // Delete transaction
    await transaction.deleteOne();

    res.status(200).json({ success: true, message: "Transaction deleted", balance: user.reaming_balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {addTransaction, getTransactions, getSingleTransaction, updateTransaction, deleteTransaction}