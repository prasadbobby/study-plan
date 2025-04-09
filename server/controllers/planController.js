// server/controllers/planController.js
const localDataService = require('../services/localDataService');
const huggingfaceService = require('../services/huggingfaceService');
const { success, error } = require('../utils/responseFormatter');

exports.generatePlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const planParams = req.body;
    const saveToDatabase = req.query.save !== 'false';
    
    try {
      const generatedPlan = await huggingfaceService.generateStudyPlan(planParams);
      
      let planId = null;
      if (saveToDatabase) {
        planId = localDataService.createPlan(userId, {
          ...generatedPlan,
          params: planParams
        });
      }
      
      res.status(201).json(success({
        planId,
        plan: generatedPlan
      }, saveToDatabase ? "Plan generated and saved successfully" : "Plan generated successfully (not saved)"));
    } catch (aiError) {
      throw aiError;
    }
  } catch (err) {
    res.status(500).json(error("Failed to generate study plan", err.message));
  }
};

exports.savePlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { params, plan } = req.body;
    
    const planId = localDataService.createPlan(userId, {
      ...plan,
      params: params
    });
    
    res.status(201).json(success({
      planId,
      plan: plan
    }, "Plan saved successfully"));
  } catch (err) {
    res.status(500).json(error("Failed to save study plan", err.message));
  }
};

exports.getUserPlans = async (req, res) => {
  try {
    const userId = req.user.uid;
    const plans = localDataService.getUserPlans(userId);
    
    res.status(200).json(success(plans));
  } catch (err) {
    res.status(500).json(error("Failed to retrieve user plans", err.message));
  }
};

exports.getPlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const planId = req.params.planId;
    
    try {
      const plan = localDataService.getPlan(userId, planId);
      
      res.status(200).json(success(plan));
    } catch (err) {
      if (err.message === "Plan not found") {
        return res.status(404).json(error("Plan not found"));
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json(error("Failed to retrieve the plan", err.message));
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const planId = req.params.planId;
    const updates = req.body;
    
    localDataService.updatePlan(userId, planId, updates);
    
    res.status(200).json(success(null, "Plan updated successfully"));
  } catch (err) {
    res.status(500).json(error("Failed to update the plan", err.message));
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const planId = req.params.planId;
    
    localDataService.deletePlan(userId, planId);
    
    res.status(200).json(success(null, "Plan deleted successfully"));
  } catch (err) {
    res.status(500).json(error("Failed to delete the plan", err.message));
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.uid;
    const planId = req.params.planId;
    const progressData = req.body;
    
    if (typeof progressData.progress !== 'number') {
      return res.status(400).json(error("Invalid progress value"));
    }
    
    if (!Array.isArray(progressData.completedTopics)) {
      return res.status(400).json(error("Completed topics must be an array"));
    }
    
    localDataService.updateProgress(userId, planId, progressData);
    
    res.status(200).json(success({ 
      updated: true,
      planId,
      progress: progressData.progress,
      completedTopicsCount: progressData.completedTopics.length
    }, "Progress updated successfully"));
  } catch (err) {
    res.status(500).json(error("Failed to update progress", err.message));
  }
};

exports.toggleStarPlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const planId = req.params.planId;
    const { isStarred } = req.body;
    
    localDataService.toggleStarPlan(userId, planId, isStarred);
    
    res.status(200).json(success(null, isStarred ? "Plan starred successfully" : "Plan unstarred successfully"));
  } catch (err) {
    res.status(500).json(error("Failed to update star status", err.message));
  }
};