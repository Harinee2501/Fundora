const express = require('express');
const { createProject, getProjects, deleteProject,getProjectById, addPhaseToProject,updatePhase,deletePhase } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const expenseRoutes = require("./expenseRoutes");
const Project = require('../models/Project'); 

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById); 
router.delete('/:id', protect, deleteProject);
router.post('/:id/phases', protect, addPhaseToProject);
router.put('/:id/phases/:phaseIndex', protect, updatePhase);
router.delete('/:id/phases/:phaseIndex', protect, deletePhase);
router.use('/:projectId/expenses', protect, expenseRoutes);
router.get('/:id/phases', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project.phases || []);
  } catch (err) {
    console.error("Error fetching phases", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;
