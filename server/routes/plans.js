// server/routes/plans.js
const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Generate a new study plan
router.post('/generate', planController.generatePlan);

// Save a pre-generated plan
router.post('/save', planController.savePlan);

// Get all plans
router.get('/', planController.getUserPlans);

// Get a specific plan
router.get('/:planId', planController.getPlan);

// Update a plan
router.put('/:planId', planController.updatePlan);

// Delete a plan
router.delete('/:planId', planController.deletePlan);

// Update progress for a plan
router.patch('/:planId/progress', planController.updateProgress);

// Toggle star status for a plan
router.patch('/:planId/star', planController.toggleStarPlan);

module.exports = router;