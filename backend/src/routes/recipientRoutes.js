const express = require('express');
const router = express.Router();
const {
  registerRecipient,
  loginRecipient,
  getProfile,
  updateProfile,
  createRequest,
  getRequests,
  deleteRequest,
  logoutRecipient
} = require('../controllers/recipientController');
const { protectRecipient } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', registerRecipient);
router.post('/login', loginRecipient);

// Protected routes
router.get('/profile', protectRecipient, getProfile);
router.put('/profile', protectRecipient, updateProfile);
router.post('/request', protectRecipient, createRequest);
router.get('/requests', protectRecipient, getRequests);
router.delete('/request/:id', protectRecipient, deleteRequest);
router.post('/logout', logoutRecipient);

module.exports = router;
