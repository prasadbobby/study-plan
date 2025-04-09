// client/src/services/planService.js
import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const currentUser = auth.currentUser;
  return {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': currentUser ? currentUser.uid : 'default-user'
    }
  };
};

export const generateStudyPlan = async (planParams, saveToDatabase = true) => {
  try {
    const config = getAuthHeader();
    const url = saveToDatabase ? '/plans/generate' : '/plans/generate?save=false';
    const response = await axios.post(`${API_URL}${url}`, planParams, config);
    return response.data;
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
};

export const getUserPlans = async () => {
  try {
    const config = getAuthHeader();
    const response = await axios.get(`${API_URL}/plans`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    throw error;
  }
};

export const getPlan = async (planId) => {
  try {
    const config = getAuthHeader();
    const response = await axios.get(`${API_URL}/plans/${planId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
};

export const updatePlan = async (planId, updates) => {
  try {
    const config = getAuthHeader();
    const response = await axios.put(`${API_URL}/plans/${planId}`, updates, config);
    return response.data;
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    const config = getAuthHeader();
    const response = await axios.delete(`${API_URL}/plans/${planId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
};

export const updateProgress = async (planId, progressData) => {
  try {
    if (typeof progressData.progress !== 'number') {
      throw new Error('Progress must be a number');
    }
    
    if (!Array.isArray(progressData.completedTopics)) {
      throw new Error('Completed topics must be an array');
    }
    
    const config = getAuthHeader();
    const response = await axios.patch(`${API_URL}/plans/${planId}/progress`, progressData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const toggleStarPlan = async (planId, isStarred) => {
  try {
    const config = getAuthHeader();
    const response = await axios.patch(`${API_URL}/plans/${planId}/star`, { isStarred }, config);
    return response.data;
  } catch (error) {
    console.error('Error toggling star status:', error);
    throw error;
  }
};

export const savePlan = async (planParams, generatedPlan) => {
  try {
    const config = getAuthHeader();
    const response = await axios.post(`${API_URL}/plans/save`, {
      params: planParams,
      plan: generatedPlan
    }, config);
    return response.data;
  } catch (error) {
    console.error('Error saving study plan:', error);
    throw error;
  }
};