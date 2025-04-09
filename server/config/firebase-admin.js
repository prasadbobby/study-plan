// server/config/firebase-admin.js
const admin = require('firebase-admin');
const path = require('path');

// Path to service account key file
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

// Initialize the app with explicit credentials
let firebaseApp;
try {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

const db = admin.firestore();

module.exports = { admin, db };