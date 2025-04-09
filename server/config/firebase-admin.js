// server/config/firebase-admin.js
const admin = require('firebase-admin');
require('dotenv').config();

let firebaseApp;

// For development, use a service account key file
try {
  // Check if already initialized
  firebaseApp = admin.app();
} catch (e) {
  try {
    // Initialize with service account
    const serviceAccount = require('../firebase-service-account.json');
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized with service account file");
  } catch (fileError) {
    console.error("Error initializing Firebase Admin:", fileError);
    
    // As a fallback for development, initialize with application default credentials
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'study-plan-okcu'
    });
    console.log("Firebase Admin initialized with application default credentials");
  }
}

const db = admin.firestore();

module.exports = { admin, db };