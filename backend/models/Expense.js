const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  receiptPath: { type: String }, // path to uploaded receipt file
  category: { type: String, required: true }, // added category field
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
