const Project = require('../models/Project');
const mongoose = require('mongoose');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, fundingAmount, funderName, startDate, endDate, description } = req.body;

    if (!title || !fundingAmount || !funderName || !startDate || !endDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const project = await Project.create({
      owner: req.user._id,
      title,
      fundingAmount,
      funderName,
      startDate,
      endDate,
      description,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error creating project", error: err.message });
  }
};

// Get all projects for logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

// Delete a project by ID (only if it belongs to logged-in user)
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Check ownership
    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" });
    }

    // Delete using safe method
    await Project.deleteOne({ _id: projectId, owner: req.user._id });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);  // For backend debugging
    res.status(500).json({ message: "Error deleting project", error: err.message });
  }
};

// Add a new phase to a project
exports.addPhaseToProject = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    console.log("Project ID param:", req.params.id);
    console.log("Phase data from request body:", req.body);

    // Check authenticated user presence
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User info missing" });
    }

    // Find project owned by user
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found or unauthorized" });

    const { phaseNumber, startDate, endDate, amountReceived } = req.body;

    // Validate inputs exist and are of correct type
    if (
      phaseNumber === undefined || isNaN(Number(phaseNumber)) ||
      !startDate || isNaN(Date.parse(startDate)) ||
      !endDate || isNaN(Date.parse(endDate)) ||
      amountReceived === undefined || isNaN(Number(amountReceived))
    ) {
      return res.status(400).json({ message: "Invalid or missing phase fields" });
    }

    // Push new phase with correct types
    project.phases.push({
      phaseNumber: Number(phaseNumber),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      amountReceived: Number(amountReceived)
    });

    await project.save();

    console.log("Phase added successfully");

    res.status(201).json(project);
  } catch (err) {
    console.error("Add phase error:", err);
    res.status(500).json({ message: "Error adding phase", error: err.message });
  }
};


// Update a specific phase
exports.updatePhase = async (req, res) => {
  try {
    const { phaseIndex } = req.params;
    const { phaseNumber, startDate, endDate, amountReceived } = req.body;

    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found or unauthorized" });

    if (!project.phases[phaseIndex]) {
      return res.status(404).json({ message: "Phase not found" });
    }

    // Update the phase
    project.phases[phaseIndex] = { phaseNumber, startDate, endDate, amountReceived };
    await project.save();

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error updating phase", error: err.message });
  }
};

// Delete a specific phase
exports.deletePhase = async (req, res) => {
  try {
    const { phaseIndex } = req.params;

    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found or unauthorized" });

    if (!project.phases[phaseIndex]) {
      return res.status(404).json({ message: "Phase not found" });
    }

    project.phases.splice(phaseIndex, 1); // remove the phase
    await project.save();

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error deleting phase", error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findOne({ _id: projectId, owner: req.user._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project", error: err.message });
  }
};


