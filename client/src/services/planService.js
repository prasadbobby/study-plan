// client/src/services/planService.js
import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  return {
    'Content-Type': 'application/json',
    'X-User-ID': currentUser.uid
  };
};

export const generateStudyPlan = async (planParams, saveToDatabase = true) => {
  try {
    const headers = getHeaders();
    const url = saveToDatabase ? '/plans/generate' : '/plans/generate?save=false';
    const response = await axios.post(`${API_URL}${url}`, planParams, { headers });
    return response.data;
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
};

export const getUserPlans = async () => {
  try {
    const headers = getHeaders();
    const response = await axios.get(`${API_URL}/plans`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    throw error;
  }
};

export const getPlan = async (planId) => {
  try {
    const headers = getHeaders();
    const response = await axios.get(`${API_URL}/plans/${planId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
};

export const updatePlan = async (planId, updates) => {
  try {
    const headers = getHeaders();
    const response = await axios.put(`${API_URL}/plans/${planId}`, updates, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
};

export const deletePlan = async (planId) => {
  try {
    const headers = getHeaders();
    const response = await axios.delete(`${API_URL}/plans/${planId}`, { headers });
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
    
    const headers = getHeaders();
    const response = await axios.patch(`${API_URL}/plans/${planId}/progress`, progressData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const toggleStarPlan = async (planId, isStarred) => {
  try {
    const headers = getHeaders();
    const response = await axios.patch(`${API_URL}/plans/${planId}/star`, { isStarred }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error toggling star status:', error);
    throw error;
  }
};

export const savePlan = async (planParams, generatedPlan) => {
  try {
    const headers = getHeaders();
    const response = await axios.post(`${API_URL}/plans/save`, {
      params: planParams,
      plan: generatedPlan
    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error saving study plan:', error);
    throw error;
  }
};