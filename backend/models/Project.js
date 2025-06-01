const mongoose = require("mongoose");

const PhaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amountReceived: { type: Number, required: true },
}, { _id: false }); 

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fundingAmount: { type: Number, required: true },
  funderName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  status: { type: String, enum: ["Active", "Completed"], default: "Active" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // to link project to user

  phases: { 
    type: [PhaseSchema],  // Array of phases
    default: [],          // Default empty array so it's never undefined
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
