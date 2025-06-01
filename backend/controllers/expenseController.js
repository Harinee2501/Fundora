const Expense = require("../models/Expense");
const path = require("path");
const fs = require("fs");

function addReceiptUrl(expense) {
  return {
    ...expense._doc,
    receiptUrl: expense.receiptPath
      ? `/${expense.receiptPath.replace(/\\/g, "/")}`
      : null,
  };
}


const createExpense = async (req, res) => {
  try {
    const { purpose, amount, date, category } = req.body;
    const projectId = req.params.projectId;

    if (!purpose || !amount || !date || !category) {
      return res
        .status(400)
        .json({ message: "Purpose, amount, date and category are required" });
    }

    const receiptPath = req.file ? req.file.path : null;

    const expense = new Expense({
      project: projectId,
      purpose,
      amount,
      date,
      category,
      receiptPath,
    });

    await expense.save();

    res.status(201).json(addReceiptUrl(expense));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating expense" });
  }
};


const getExpenses = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const expenses = await Expense.find({ project: projectId }).sort({ createdAt: -1 });

    const expensesWithUrl = expenses.map(addReceiptUrl);
    res.json(expensesWithUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
};


const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const { purpose, amount, date, category } = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (req.file && expense.receiptPath) {
      fs.unlink(expense.receiptPath, (err) => {
        if (err) console.warn("Failed to delete old receipt:", err);
      });
    }

    expense.purpose = purpose || expense.purpose;
    expense.amount = amount || expense.amount;
    expense.date = date || expense.date;
    expense.category = category || expense.category;
    expense.receiptPath = req.file ? req.file.path : expense.receiptPath;

    await expense.save();

    res.json(addReceiptUrl(expense));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating expense" });
  }
};


const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.receiptPath) {
      fs.unlink(expense.receiptPath, (err) => {
        if (err) console.warn("Failed to delete receipt:", err);
      });
    }

    await expense.deleteOne();

    const projectId = expense.project;
    const expenses = await Expense.find({ project: projectId }).sort({ createdAt: -1 });
    const expensesWithUrl = expenses.map(addReceiptUrl);

    res.json(expensesWithUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting expense" });
  }
};


const downloadReceipt = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const expense = await Expense.findById(expenseId);
    if (!expense || !expense.receiptPath) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.download(path.resolve(expense.receiptPath));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error downloading receipt" });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  downloadReceipt,
};
