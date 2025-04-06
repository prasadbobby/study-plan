// client/src/contexts/PlanContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { 
  getUserPlans, 
  getPlan, 
  generateStudyPlan, 
  savePlan,
  updatePlan, 
  deletePlan,
  updateProgress,
  toggleStarPlan
} from '../services/planService';

const PlanContext = createContext();

export function usePlans() {
  return useContext(PlanContext);
}

export function PlanProvider({ children }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


const fetchPlans = async () => {
  // Don't fetch if already loading or if we already have plans
  if (loading || plans.length > 0) return;
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await getUserPlans();
    setPlans(response.data || []);
  } catch (error) {
    setError('Failed to fetch plans. Please try again.');
    console.error('Error fetching plans:', error);
  } finally {
    setLoading(false);
  }
};



// Generate a new study plan
const generatePlan = async (planParams, saveToDatabase = true, preGeneratedPlan = null) => {
  setLoading(true);
  setError(null);
  
  try {
    // If we have a pre-generated plan and want to save it
    if (preGeneratedPlan && saveToDatabase) {
      console.log("Saving pre-generated plan to database");
      const response = await savePlan(planParams, preGeneratedPlan);
      await fetchPlans(); // Refresh plans
      return response.data;
    }
    
    // If we need to generate a new plan
    const response = await generateStudyPlan(planParams, saveToDatabase);
    
    // If we saved to database, refresh plans
    if (saveToDatabase) {
      await fetchPlans();
    }
    
    return response.data;
  } catch (error) {
    setError('Failed to generate plan. Please try again.');
    console.error('Error generating plan:', error);
    return null;
  } finally {
    setLoading(false);
  }
};


  // Get a specific plan
  const fetchPlan = async (planId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPlan(planId);
      return response.data;
    } catch (error) {
      setError('Failed to fetch plan. Please try again.');
      console.error('Error fetching plan:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a plan
  const updateStudyPlan = async (planId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      await updatePlan(planId, updates);
      await fetchPlans(); // Refresh plans
      return true;
    } catch (error) {
      setError('Failed to update plan. Please try again.');
      console.error('Error updating plan:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a plan
  const removeStudyPlan = async (planId) => {
    setLoading(true);
    setError(null);
    
    try {
      await deletePlan(planId);
      await fetchPlans(); // Refresh plans
      return true;
    } catch (error) {
      setError('Failed to delete plan. Please try again.');
      console.error('Error deleting plan:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update progress for a plan
  const trackProgress = async (planId, progressData) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateProgress(planId, progressData);
      await fetchPlans(); // Refresh plans
      return true;
    } catch (error) {
      setError('Failed to update progress. Please try again.');
      console.error('Error updating progress:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Star or unstar a plan
  const toggleStar = async (planId, isStarred) => {
    setLoading(true);
    setError(null);
    
    try {
      await toggleStarPlan(planId, isStarred);
      await fetchPlans(); // Refresh plans
      return true;
    } catch (error) {
      setError('Failed to update star status. Please try again.');
      console.error('Error updating star status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filter starred plans
  const getStarredPlans = () => {
    return plans.filter(plan => plan.isStarred);
  };

  // Filter tracked plans
  const getTrackedPlans = () => {
    return plans.filter(plan => plan.isTracked);
  };

  // Filter in-progress plans
  const getInProgressPlans = () => {
    return plans.filter(plan => plan.status === 'active' && plan.progress < 100);
  };

  // Filter completed plans
  const getCompletedPlans = () => {
    return plans.filter(plan => plan.status === 'active' && plan.progress === 100);
  };

  const value = {
    plans,
    loading,
    error,
    fetchPlans,
    generatePlan,
    fetchPlan,
    updateStudyPlan,
    removeStudyPlan,
    trackProgress,
    toggleStar,
    getStarredPlans,
    getTrackedPlans,
    getInProgressPlans,
    getCompletedPlans
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}