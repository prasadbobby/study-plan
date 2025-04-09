// server/middleware/auth.js
const { admin } = require('../config/firebase-admin');
const { error } = require('../utils/responseFormatter');

module.exports = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json(error("Unauthorized: No user ID provided"));
  }
  
  req.user = { uid: userId };
  next();
};