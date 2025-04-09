// server/services/localDataService.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/user-plans.json');

const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const initDataFile = () => {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
  }
};

const readData = () => {
  initDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const writeData = (data) => {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
};

const getUserPlans = (userId) => {
  const data = readData();
  if (!data[userId]) {
    data[userId] = [];
    writeData(data);
  }
  return data[userId];
};

const createPlan = (userId, planData) => {
  const data = readData();
  if (!data[userId]) {
    data[userId] = [];
  }
  
  const planId = `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newPlan = {
    id: planId,
    ...planData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    progress: 0,
    isStarred: false,
    isTracked: true,
    completedTopics: []
  };
  
  data[userId].unshift(newPlan);
  writeData(data);
  
  return planId;
};

const getPlan = (userId, planId) => {
  const data = readData();
  if (!data[userId]) {
    throw new Error('User not found');
  }
  
  const plan = data[userId].find(p => p.id === planId);
  if (!plan) {
    throw new Error('Plan not found');
  }
  
  return plan;
};

const updatePlan = (userId, planId, updates) => {
  const data = readData();
  if (!data[userId]) {
    throw new Error('User not found');
  }
  
  const planIndex = data[userId].findIndex(p => p.id === planId);
  if (planIndex === -1) {
    throw new Error('Plan not found');
  }
  
  data[userId][planIndex] = {
    ...data[userId][planIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return writeData(data);
};

const deletePlan = (userId, planId) => {
  const data = readData();
  if (!data[userId]) {
    throw new Error('User not found');
  }
  
  data[userId] = data[userId].filter(p => p.id !== planId);
  return writeData(data);
};

const updateProgress = (userId, planId, progressData) => {
  const data = readData();
  if (!data[userId]) {
    throw new Error('User not found');
  }
  
  const planIndex = data[userId].findIndex(p => p.id === planId);
  if (planIndex === -1) {
    throw new Error('Plan not found');
  }
  
  data[userId][planIndex] = {
    ...data[userId][planIndex],
    progress: progressData.progress,
    completedTopics: progressData.completedTopics,
    updatedAt: new Date().toISOString()
  };
  
  return writeData(data);
};

const toggleStarPlan = (userId, planId, isStarred) => {
  const data = readData();
  if (!data[userId]) {
    throw new Error('User not found');
  }
  
  const planIndex = data[userId].findIndex(p => p.id === planId);
  if (planIndex === -1) {
    throw new Error('Plan not found');
  }
  
  data[userId][planIndex] = {
    ...data[userId][planIndex],
    isStarred,
    updatedAt: new Date().toISOString()
  };
  
  return writeData(data);
};

module.exports = {
  getUserPlans,
  createPlan,
  getPlan,
  updatePlan,
  deletePlan,
  updateProgress,
  toggleStarPlan
};