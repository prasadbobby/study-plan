// server/services/firestore.js
const { db } = require('../config/firebase-admin');

class FirestoreService {
  async createPlan(userId, planData) {
    try {
      const planWithTimestamp = {
        ...planData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        progress: 0,
        isStarred: false,
        isTracked: true,
        completedTopics: []
      };
      
      const planRef = db.collection('users').doc(userId).collection('plans').doc();
      await planRef.set(planWithTimestamp);
      return planRef.id;
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error;
    }
  }
  
  async getUserPlans(userId) {
    try {
      const plansSnapshot = await db.collection('users').doc(userId).collection('plans')
        .orderBy('createdAt', 'desc')
        .get();
      
      if (plansSnapshot.empty) {
        return [];
      }
      
      const plans = plansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return plans;
    } catch (error) {
      console.error("Error getting user plans:", error);
      throw error;
    }
  }
  
  async getPlan(userId, planId) {
    try {
      const planDoc = await db.collection('users').doc(userId).collection('plans').doc(planId).get();
      
      if (!planDoc.exists) {
        throw new Error("Plan not found");
      }
      
      return {
        id: planDoc.id,
        ...planDoc.data()
      };
    } catch (error) {
      console.error("Error getting plan:", error);
      throw error;
    }
  }
  
  async updatePlan(userId, planId, updates) {
    try {
      await db.collection('users').doc(userId).collection('plans').doc(planId).update({
        ...updates,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  }
  
  async deletePlan(userId, planId) {
    try {
      await db.collection('users').doc(userId).collection('plans').doc(planId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  }
  
  async updateProgress(userId, planId, progressData) {
    try {
      if (typeof progressData.progress !== 'number') {
        throw new Error("Progress must be a number");
      }
      
      if (!Array.isArray(progressData.completedTopics)) {
        throw new Error("Completed topics must be an array");
      }
      
      const planRef = db.collection('users').doc(userId).collection('plans').doc(planId);
      const planDoc = await planRef.get();
      
      if (!planDoc.exists) {
        throw new Error(`Plan ${planId} not found`);
      }
      
      await planRef.update({
        progress: progressData.progress,
        completedTopics: progressData.completedTopics,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  }
  
  async toggleStarPlan(userId, planId, isStarred) {
    try {
      await db.collection('users').doc(userId).collection('plans').doc(planId).update({
        isStarred,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error("Error toggling star status:", error);
      throw error;
    }
  }
}

module.exports = new FirestoreService();