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
const { getAllBloodStockForRecipients,getHospitalList } = require("../controllers/hospitalController");


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



//DEBUGGING PURPOSE - Get all blood stock for recipients
router.get("/all-blood-stock", protectRecipient, getAllBloodStockForRecipients);
router.get('/hospitals', protectRecipient, getHospitalList);


module.exports = router;
