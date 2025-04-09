// server/middleware/auth.js
module.exports = (req, res, next) => {
  // Always allow requests to proceed without authentication checks
  const userId = req.headers['x-user-id'] || 'default-user';
  req.user = { uid: userId };
  next();
};